import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json, os
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import LLMChain




load_dotenv()




model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384
RECRUITEE_INDEX_PATH = 'recruitee.index'
RECRUITER_INDEX_PATH = 'recruiter.index'
MAPPING_PATH_RECRUITEE = 'chunk_to_recruitee.json'
MAPPING_PATH_RECRUITER = 'chunk_to_recruiter.json'

index = faiss.IndexIDMap(faiss.IndexFlatL2(dimension))

def extract_text_from_pdf(path):
    doc = fitz.open(path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text

def get_embeddings(text):
    return model.encode(text)

def encode_new_recruitee(pdf_path, description, user_id):
    internal_ids = []

    if os.path.exists(MAPPING_PATH_RECRUITEE):
        with open(MAPPING_PATH_RECRUITEE, 'r') as f:
            chunk_to_user = json.load(f)
    else:
        chunk_to_user = {}

    current_id = len(chunk_to_user)

    if os.path.exists(RECRUITEE_INDEX_PATH):
        index = faiss.read_index(RECRUITEE_INDEX_PATH)
    else:
        index = faiss.IndexIDMap(faiss.IndexFlatIP(dimension))

    text = extract_text_from_pdf(pdf_path) + "\n" + description
    chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_text(text)
    embeddings = [get_embeddings(chunk) for chunk in chunks]

    for i, chunk in enumerate(chunks):
        chunk_id = current_id + i
        internal_ids.append(chunk_id)
        chunk_to_user[str(chunk_id)] = {
            "user_id": user_id,
            "chunk": chunk
        }

    embedding_matrix = np.array(embeddings).astype('float32')
    faiss.normalize_L2(embedding_matrix)
    faiss_ids = np.array(internal_ids).astype('int64')
    index.add_with_ids(embedding_matrix, faiss_ids)

    faiss.write_index(index, RECRUITEE_INDEX_PATH)
    with open(MAPPING_PATH_RECRUITEE, 'w') as f:
        json.dump(chunk_to_user, f, indent=2)


def encode_new_recruiter(looking_for, user_id):
    internal_ids = []

    if os.path.exists(MAPPING_PATH_RECRUITER):
        with open(MAPPING_PATH_RECRUITER, 'r') as f:
            chunk_to_user = json.load(f)
    else:
        chunk_to_user = {}

    current_id = len(chunk_to_user)

    if os.path.exists(RECRUITER_INDEX_PATH):
        index = faiss.read_index(RECRUITER_INDEX_PATH)
    else:
        index = faiss.IndexIDMap(faiss.IndexFlatIP(dimension))

    text = looking_for
    chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_text(text)
    embeddings = [get_embeddings(chunk) for chunk in chunks]

    for i, chunk in enumerate(chunks):
        chunk_id = current_id + i
        internal_ids.append(chunk_id)
        chunk_to_user[str(chunk_id)] = {
            "user_id": user_id,
            "chunk": chunk
        }

    embedding_matrix = np.array(embeddings).astype('float32')
    faiss.normalize_L2(embedding_matrix)
    faiss_ids = np.array(internal_ids).astype('int64')
    index.add_with_ids(embedding_matrix, faiss_ids)

    faiss.write_index(index, RECRUITER_INDEX_PATH)
    with open(MAPPING_PATH_RECRUITER, 'w') as f:
        json.dump(chunk_to_user, f, indent=2)

user_memories = {}

def get_langchain_response(user_id, user_type, name, user_prompt, additional_info):
    if user_id not in user_memories:
        user_memories[user_id] = []

    
    chat_history = user_memories[user_id]

    llm = AzureChatOpenAI(
        deployment_name="gpt-4o",
        openai_api_key=os.getenv("API_KEY"),
        azure_endpoint="https://aqore-hackathon-openai.openai.azure.com",
        openai_api_version="2025-01-01-preview",
        temperature=0.7
    )

   
    messages = [
        SystemMessage(content=f"""
You are Dalal, an AI staffing assistant that brokers between recruiters and recruitees.

Your job is to:
- Help recruiters find candidates using natural language queries.
- Help job seekers find jobs and update profiles.

NEVER hallucinate. If something isn't available, say so politely.

Prompter: {name}, Type: {user_type}

Original Prompt: {user_prompt}

Additional Information (from database):
{additional_info}
""")
    ]
    
   
    messages.extend(chat_history)
    
    
    messages.append(HumanMessage(content=user_prompt))

   
    response = llm(messages)
    
    
    user_memories[user_id].append(HumanMessage(content=user_prompt))
    user_memories[user_id].append(AIMessage(content=response.content))
    
    
    if len(user_memories[user_id]) > 20:  
        user_memories[user_id] = user_memories[user_id][-20:]

    return response.content