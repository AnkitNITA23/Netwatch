from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file relative to this file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Get MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)

db = client["netwatch"]

traffic_collection = db["traffic"] # snapshot aggregates
packets_collection = db["packets"] # raw packet logs
