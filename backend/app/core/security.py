from cryptography.fernet import Fernet
from app.core.config import settings
import json
import base64

def get_fernet():
    """Get Fernet instance for encryption/decryption"""
    return Fernet(settings.FERNET_KEY.encode())

def encrypt(data: bytes) -> bytes:
    """Encrypt data using Fernet"""
    f = get_fernet()
    return f.encrypt(data)

def decrypt(encrypted_data: bytes) -> bytes:
    """Decrypt data using Fernet"""
    f = get_fernet()
    return f.decrypt(encrypted_data)

def encrypt_json(data: dict) -> str:
    """Encrypt JSON data and return as base64 string"""
    json_str = json.dumps(data)
    encrypted = encrypt(json_str.encode())
    return base64.b64encode(encrypted).decode()

def decrypt_json(encrypted_data: str) -> dict:
    """Decrypt base64 string and return as JSON dict"""
    encrypted_bytes = base64.b64decode(encrypted_data.encode())
    decrypted = decrypt(encrypted_bytes)
    return json.loads(decrypted.decode()) 