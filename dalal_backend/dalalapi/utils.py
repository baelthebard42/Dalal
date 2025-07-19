import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json, os
from dotenv import load_dotenv
from openai import AzureOpenAI

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

    

def get_ai_response(prompt):

    
    client = AzureOpenAI(
    api_key=os.getenv('API_KEY') , 
    api_version="2025-01-01-preview", 
    azure_endpoint="https://aqore-hackathon-openai.openai.azure.com"
)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """
You are Dalal, an AI staffing assistant that acts as a conversational broker between recruiters and job seekers.

Your job is to:
- Help recruiters find suitable candidates based on natural language queries.
- Help job seekers discover relevant jobs and update their profiles.

It will be defined in the prompt if the user is a recruiter or recruitee. One user cannot be both at a time. If not defined, ask and keep track 
You will receive structured information about recruiters or recruitees from a central database.
Your responses must be based on:
- The user’s query
- The retrieved data
- Applying smart filtering to return only the most relevant results.

You should:
- Answer naturally and professionally.
- Summarize, filter, and rephrase data clearly.
- Ask clarifying questions if the request is vague.
- Tell the politely to stay in topic if any question out of this scope is asked
            

You must not hallucinate missing data. If something isn’t available, inform the user politely and suggest next steps.

Most important: You will be given prompts in two parts: Original User Prompt and Additional Information. Always prioritize the user prompt and discard the additional information if irrelevant.
             If the additional info consists info the prompt doesnt ask for, discard them as well. 
"""
},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content
    


print(get_ai_response("find me best jobs"))