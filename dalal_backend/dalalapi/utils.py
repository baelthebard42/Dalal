import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json, os




model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384
INDEX_PATH = 'recruitee.index'
MAPPING_PATH = 'chunk_to_recruitee.json'

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
    
    if os.path.exists(MAPPING_PATH):
        
        with open(MAPPING_PATH, 'r') as f:
            chunk_to_user = json.load(f)
    else:
        chunk_to_user = {}

    current_id = len(chunk_to_user)

    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
    else:
        index = faiss.IndexIDMap(faiss.IndexFlatL2(dimension))
    

    text = extract_text_from_pdf(pdf_path) + "\n" + description
    chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_text(text)
    embeddings = [get_embeddings(chunk) for chunk in chunks]

    for i, chunk in enumerate(chunks):
     chunk_id = current_id + i
     internal_ids.append(chunk_id)
     chunk_to_user[str(chunk_id)] = user_id
    
    embedding_matrix = np.array(embeddings).astype('float32')
    faiss_ids = np.array(internal_ids).astype('int64')
    index.add_with_ids(embedding_matrix, faiss_ids)

    faiss.write_index(index, INDEX_PATH)
    with open(MAPPING_PATH, 'w') as f:
        json.dump(chunk_to_user, f, indent=2)
    
    return

    

     