import React, { useState } from 'react';
import { Upload, FileText, Download, Sparkles, Loader2, CheckCircle, Edit2, Save, FileDown } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ResumeGenerator() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-blue-600 to-purple-600', desc: 'Clean and contemporary' },
    { id: 'professional', name: 'Professional', color: 'bg-gradient-to-br from-gray-700 to-gray-900', desc: 'Classic business style' },
    { id: 'creative', name: 'Creative', color: 'bg-gradient-to-br from-pink-500 to-orange-500', desc: 'Bold and colorful' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gradient-to-br from-teal-500 to-green-600', desc: 'Simple and elegant' },
    { id: 'executive', name: 'Executive', color: 'bg-gradient-to-br from-indigo-600 to-blue-700', desc: 'Senior professional' },
    { id: 'tech', name: 'Tech', color: 'bg-gradient-to-br from-cyan-500 to-blue-500', desc: 'Tech-focused design' }
  ];

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.docx') && !uploadedFile.name.endsWith('.doc')) {
      setError('Please upload a .doc or .docx file');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setParsedData(result.data);
        setEditedData(result.data);
        setStep(2);
      } else {
        setError(result.error || 'Failed to process document');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the Python backend is running on port 5000.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fakeEvent = { target: { files: [droppedFile] } };
      handleFileUpload(fakeEvent);
    }
  };

  const handleEdit = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !editedData.skills.includes(skill)) {
      setEditedData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (index) => {
    setEditedData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const saveEdits = () => {
    setParsedData(editedData);
    setIsEditing(false);
  };

  const generateResume = () => {
    setStep(3);
  };

  const downloadResume = async (format = 'pdf') => {
    const endpoint = format === 'pdf' ? 'generate-pdf' : 'generate-docx';
    
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: editedData,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${new Date().getTime()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError(`Failed to generate ${format.toUpperCase()}`);
      }
    } catch (err) {
      setError('Failed to download resume');
      console.error(err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ModernTemplate = ({ data }) => (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
      <div className="border-l-4 border-blue-600 pl-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          {data.email && <p>{data.email}</p>}
          {data.phone && <p>{data.phone}</p>}
          {data.location && <p>{data.location}</p>}
          {data.linkedin && <p className="text-blue-600">{data.linkedin}</p>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">EXPERIENCE</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold text-lg">{exp.title}</h3>
              <p className="text-gray-600 text-sm">{exp.company} | {exp.period}</p>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">EDUCATION</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-bold">{edu.degree}</h3>
              <p className="text-gray-600 text-sm">{edu.institution} | {edu.year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfessionalTemplate = ({ data }) => (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{exp.title}</h3>
                <span className="text-gray-600 text-sm">{exp.period}</span>
              </div>
              <p className="text-gray-600 text-sm italic">{exp.company}</p>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-gray-600 text-sm">{edu.year}</span>
              </div>
              <p className="text-gray-600 text-sm">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Skills</h2>
          <p className="text-gray-700">{data.skills.join(' • ')}</p>
        </div>
      )}
    </div>
  );

  const resetApp = () => {
    setStep(1);
    setFile(null);
    setParsedData(null);
    setEditedData(null);
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 animate-pulse" />
            AI Resume Generator 
          </h1>
          <p className="text-purple-200 text-lg">Upload your document and create a professional resume in minutes</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg mb-6 text-center shadow-lg animate-shake">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-white text-purple-900 shadow-lg scale-110' : 'bg-purple-700 text-white'
              }`}>
                {step > s ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              <span className="text-white text-sm font-medium">
                {s === 1 ? 'Upload' : s === 2 ? 'Customize' : 'Generate'}
              </span>
              {s < 3 && <div className="w-16 h-1 bg-purple-700 rounded"></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <label className="block w-full">
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-4 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                    file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  {isProcessing ? (
                    <div className="space-y-4">
                      <Loader2 className="w-20 h-20 mx-auto text-purple-600 animate-spin" />
                      <p className="text-xl font-bold text-gray-700">Processing your document...</p>
                      <p className="text-sm text-gray-500">AI is analyzing your resume data</p>
                      <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-purple-600 animate-progress"></div>
                      </div>
                    </div>
                  ) : file ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-20 h-20 mx-auto text-green-600" />
                      <p className="text-xl font-bold text-gray-700">{file.name}</p>
                      <p className="text-sm text-green-600 font-medium">✓ File uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Upload className="w-20 h-20 mx-auto text-gray-400" />
                      <div>
                        <p className="text-2xl font-bold text-gray-700 mb-2">Drop your resume here</p>
                        <p className="text-gray-500">or click to browse</p>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          .DOC
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          .DOCX
                        </span>
                        <span>•</span>
                        <span>Max 16MB</span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 2 && editedData && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Customize Your Resume</h2>
              <div className="flex items-center gap-4">
                {parsedData.score && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Resume Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(parsedData.score)}`}>
                      {parsedData.score}%
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => handleEdit('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleEdit('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleEdit('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editedData.location}
                      onChange={(e) => handleEdit('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    value={editedData.summary}
                    onChange={(e) => handleEdit('summary', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedData.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        {skill}
                        <button onClick={() => handleSkillRemove(idx)} className="text-red-600 hover:text-red-800">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveEdits}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {editedData.name}</div>
                  <div><strong>Email:</strong> {editedData.email || 'Not provided'}</div>
                  <div><strong>Phone:</strong> {editedData.phone || 'Not provided'}</div>
                  <div><strong>Location:</strong> {editedData.location || 'Not provided'}</div>
                </div>
                {editedData.skills && editedData.skills.length > 0 && (
                  <div className="mt-4">
                    <strong className="text-sm">Skills ({editedData.skills.length}):</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedData.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Template</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`${template.color} rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 ${
                      selectedTemplate === template.id ? 'ring-4 ring-white shadow-2xl scale-105' : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="text-white text-center">
                      <div className="w-full h-20 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-sm">{template.name}</p>
                      <p className="text-xs opacity-80 mt-1">{template.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateResume}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <Sparkles className="w-6 h-6" />
              Generate My Resume
            </button>
          </div>
        )}

        {step === 3 && editedData && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-900">Your Professional Resume</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadResume('pdf')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => downloadResume('docx')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <FileDown className="w-5 h-5" />
                    Download DOCX
                  </button>
                </div>
              </div>
              
              <div id="resume-preview" className="bg-gray-100 p-8 rounded-xl overflow-auto max-h-screen shadow-inner">
                {(selectedTemplate === 'modern' || selectedTemplate === 'executive' || selectedTemplate === 'tech') && 
                  <ModernTemplate data={editedData} />}
                {(selectedTemplate === 'professional' || selectedTemplate === 'minimal' || selectedTemplate === 'creative') && 
                  <ProfessionalTemplate data={editedData} />}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-all"
              >
                ← Back to Edit
              </button>
              <button
                onClick={resetApp}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
              >
                Create Another Resume
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}