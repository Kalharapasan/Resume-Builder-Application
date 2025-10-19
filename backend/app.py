from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from docx import Document
import re
import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import spacy
from werkzeug.utils import secure_filename



app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'doc', 'docx'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    nlp = spacy.load("en_core_web_sm")
    print("✓ spaCy model loaded successfully")
except Exception as e:
    print(f"⚠ Warning: spaCy model not loaded: {e}")
    print("  Install with: python -m spacy download en_core_web_sm")
    nlp = None
    


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Resume Generator API Starting...")
    print("="*50)
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"🤖 spaCy loaded: {'✓ Yes' if nlp else '✗ No'}")
    print(f"🌐 Server: http://localhost:5000")
    print(f"💚 Health: http://localhost:5000/api/health")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)