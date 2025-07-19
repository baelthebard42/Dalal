import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384
index = faiss.IndexIDMap(faiss.IndexFlatL2(dimension))


def extract_text_from_pdf(path):
    doc = fitz.open(path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text

def get_embeddings(text):
    return model.encode(text)

all_chunks = []
internal_ids = []
chunk_to_user = {}  
chunk_text_map = {} 
current_id = 0

text1 = extract_text_from_pdf("cashier.pdf")
chunks1 = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_text(text1)
embeddings1 = [get_embeddings(chunk) for chunk in chunks1]

for i, chunk in enumerate(chunks1):
    chunk_id = current_id + i
    internal_ids.append(chunk_id)
    chunk_to_user[chunk_id] = "user_cashier"
    chunk_text_map[chunk_id] = chunk

current_id += len(chunks1)


text2 = extract_text_from_pdf("software_engineer.pdf")
chunks2 = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_text(text2)
embeddings2 = [get_embeddings(chunk) for chunk in chunks2]

for i, chunk in enumerate(chunks2):
    chunk_id = current_id + i
    internal_ids.append(chunk_id)
    chunk_to_user[chunk_id] = "user_software_engineer"
    chunk_text_map[chunk_id] = chunk


all_embeddings = embeddings1 + embeddings2
embedding_matrix = np.array(all_embeddings).astype('float32')
faiss_ids = np.array(internal_ids).astype('int64')


index.add_with_ids(embedding_matrix, faiss_ids)


query = input("Enter your query: ")
query_embedding = model.encode([query]).astype('float32')

D, I = index.search(query_embedding, k=1)


top_id = I[0][0]
print(f"\n🔎 Top matched chunk:\n{chunk_text_map[top_id]}")
print(f"\n👤 Belongs to: {chunk_to_user[top_id]}")
