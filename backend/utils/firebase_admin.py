import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import os

# Initialize Firebase Admin SDK only once
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_CREDENTIAL"))
    firebase_admin.initialize_app(cred)
