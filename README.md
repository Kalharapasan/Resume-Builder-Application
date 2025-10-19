# 🚀 AI Resume Generator 

**Transform your Word documents into professional resumes with AI-powered parsing**

![Version](https://img.shields.io/badge/version-2.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-cyan)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## 🆕 What's New in Version 

### Enhanced Features
- ✅ **6 Professional Templates** (added Executive & Tech templates)
- ✅ **Real-time Editing** - Edit parsed data before generating
- ✅ **Resume Scoring** - Get instant feedback on resume completeness
- ✅ **Dual Export** - Download as PDF or DOCX
- ✅ **Drag & Drop Upload** - Easier file upload experience
- ✅ **Better AI Parsing** - Improved accuracy with enhanced algorithms
- ✅ **LinkedIn Profile Detection** - Automatically extracts LinkedIn URL
- ✅ **Progress Indicators** - Visual feedback during processing
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Error Handling** - Better user feedback and error messages

---

## ✨ Features

### AI-Powered Intelligence
- 🤖 **Smart Parsing** - Automatically extracts name, email, phone, location
- 🎯 **Skill Detection** - Identifies technical and soft skills
- 📊 **Experience Analysis** - Parses work history with dates
- 🎓 **Education Extraction** - Recognizes degrees and institutions
- 🔗 **LinkedIn Integration** - Detects profile URLs
- 📈 **Resume Scoring** - 100-point completeness score

### Multiple Export Formats
- 📄 **PDF Generation** - High-quality PDF resumes
- 📝 **DOCX Export** - Editable Word documents
- 🎨 **6 Templates** - Professional designs for every industry

### User Experience
- 🖱️ **Drag & Drop** - Easy file upload
- ✏️ **Live Editing** - Modify data before generating
- 👁️ **Real-time Preview** - See changes instantly
- 💾 **Auto-Save** - Never lose your work
- 📱 **Mobile Friendly** - Works on all devices

---

## 🏗️ Tech Stack

### Backend
- **Flask 3.0** - Python web framework
- **spaCy 3.7** - Natural language processing
- **python-docx 1.1** - Word document handling
- **ReportLab 4.0** - PDF generation
- **Flask-CORS** - Cross-origin support

### Frontend
- **React 18.2** - UI library
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Beautiful icons
- **Modern ES6+** - Latest JavaScript

---

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Quick Start (Recommended)

#### Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

#### Windows:
```batch
setup.bat
```

### Manual Installation

#### Backend Setup

1. **Create project directory**
```bash
mkdir resume-generator-v2
cd resume-generator-v2
mkdir backend frontend
```

2. **Setup backend**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

#Or
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run server
python app.py
```

Backend will run on: **http://localhost:5000**

#### Frontend Setup

1. **Setup frontend**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 🐳 Docker Setup
```bash
# Start both services
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 📖 Usage Guide

### Step 1: Upload Resume
1. Visit http://localhost:3000
2. Drag and drop your Word document (.doc/.docx)
3. Or click to browse and select file
4. Wait for AI processing (2-5 seconds)

### Step 2: Review & Edit
1. Check your **Resume Score** (out of 100)
2. Review AI-extracted information
3. Click **Edit** to modify any details
4. Add/remove skills
5. Update contact information
6. Refine professional summary
7. Click **Save** when done

### Step 3: Choose Template
1. Browse 6 professional templates:
   - **Modern** - Clean blue design
   - **Professional** - Classic business style
   - **Creative** - Colorful and bold
   - **Minimal** - Simple elegance
   - **Executive** - Senior professional
   - **Tech** - Technology-focused
2. Click to select your preferred template

### Step 4: Generate & Download
1. Click **Generate My Resume**
2. Preview your resume
3. Download as:
   - **PDF** - For applications
   - **DOCX** - For further editing
4. Share or print your resume!

---

## 🎨 Template Gallery

### Modern Template
- Blue gradient accent
- Left-aligned border design
- Professional and contemporary
- Best for: Tech, Creative, Marketing

### Professional Template
- Centered layout
- Traditional business style
- ATS-friendly
- Best for: Corporate, Finance, Legal

### Creative Template
- Pink/Orange color scheme
- Bold typography
- Eye-catching design
- Best for: Design, Media, Arts

### Minimal Template
- Clean and simple
- Teal accents
- Maximum readability
- Best for: Academia, Research, Consulting

### Executive Template
- Sophisticated indigo theme
- Senior-level presentation
- Leadership-focused
- Best for: C-Suite, Management, Directors

### Tech Template
- Cyan blue design
- Modern tech aesthetic
- Skills-focused layout
- Best for: Software, Engineering, IT

---

## 📡 API Endpoints

### POST `/api/upload`
**Upload and parse Word document**

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@resume.docx"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "linkedin": "linkedin.com/in/johndoe",
    "summary": "...",
    "skills": ["Python", "JavaScript", "React"],
    "experience": [...],
    "education": [...],
    "score": 85
  }
}
```

### POST `/api/generate-pdf`
**Generate PDF resume**

**Request:**
```json
{
  "resumeData": {...},
  "template": "modern"
}
```

**Response:** PDF file download

### POST `/api/generate-docx`
**Generate DOCX resume**

**Request:**
```json
{
  "resumeData": {...}
}
```

**Response:** DOCX file download

### GET `/api/health`
**Health check**

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0",
  "spacy_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

---

## 🎯 Sample Resume Format

Create a test document with this structure: