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