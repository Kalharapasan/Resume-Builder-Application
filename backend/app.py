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
    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class ResumeParser:
    def __init__(self, text):
        self.text = text
        self.lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        
    def extract_email(self):
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, self.text)
        return matches[0] if matches else ""
    
    def extract_phone(self):
        """Extract phone number from text"""
        phone_patterns = [
            r'\+?1?\s*\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})',
            r'\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}',
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        ]
        for pattern in phone_patterns:
            match = re.search(pattern, self.text)
            if match:
                return match.group(0)
        return ""

    def extract_name(self):
        """Extract name (usually first line or first capitalized words)"""
        if self.lines:
            first_line = self.lines[0]
            first_line = re.sub(r'^(Resume|CV|Curriculum Vitae)[\s:]*', '', first_line, flags=re.IGNORECASE)
            if len(first_line.split()) <= 5 and first_line[0].isupper():
                return first_line
        return "Your Name"
    
    def extract_location(self):
        """Extract location/address"""
        location_pattern = r'\b[A-Z][a-z]+,\s*[A-Z]{2}\b'
        match = re.search(location_pattern, self.text)
        return match.group(0) if match else ""
    
    def extract_skills(self):
        """Extract technical and soft skills"""
        skills = []
        
        tech_skills = [
            'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
            'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
            'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
            'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap', 'REST API', 'GraphQL',
            'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
            'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust',
            'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Microservices', 'Linux'
        ]
        
        text_lower = self.text.lower()
        skills_keywords = ['skills', 'technical skills', 'competencies', 'expertise', 'technologies']
        
        for keyword in skills_keywords:
            idx = text_lower.find(keyword)
            if idx != -1:
                skills_section = self.text[idx:idx+500]
                for skill in tech_skills:
                    if re.search(r'\b' + re.escape(skill) + r'\b', skills_section, re.IGNORECASE):
                        skills.append(skill)
                break
        
        if not skills:
            for skill in tech_skills[:15]:
                if re.search(r'\b' + re.escape(skill) + r'\b', self.text, re.IGNORECASE):
                    skills.append(skill)
        
        if nlp and len(skills) < 5:
            doc = nlp(self.text[:1500])
            for chunk in doc.noun_chunks:
                chunk_text = chunk.text.strip()
                if 2 <= len(chunk_text.split()) <= 3 and chunk_text[0].isupper():
                    if chunk_text not in skills and len(skills) < 12:
                        skills.append(chunk_text)
        
        skills = list(dict.fromkeys(skills))[:12]
        return skills if skills else ["Communication", "Problem Solving", "Teamwork", "Leadership"]
    
    

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