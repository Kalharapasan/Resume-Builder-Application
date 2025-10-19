import React, { useState } from 'react';
import { Upload, FileText, Download, Sparkles, Loader2, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ResumeGenerator() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-blue-600 to-purple-600' },
    { id: 'professional', name: 'Professional', color: 'bg-gradient-to-br from-gray-700 to-gray-900' },
    { id: 'creative', name: 'Creative', color: 'bg-gradient-to-br from-pink-500 to-orange-500' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gradient-to-br from-teal-500 to-green-600' }
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

  const generateResume = () => {
    setStep(3);
  };

  const downloadResume = async () => {
    try {
      const response = await fetch(`${API_URL}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: parsedData,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to generate PDF');
      }
    } catch (err) {
      setError('Failed to download resume');
      console.error(err);
    }
  };

  const ModernTemplate = ({ data }) => (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
      <div className="border-l-4 border-blue-600 pl-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          {data.email && <p>{data.email}</p>}
          {data.phone && <p>{data.phone}</p>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700">{data.summary}</p>
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

      {data.skills && data.skills.length > 0 && (
        <div>
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
    </div>
  );

  const ProfessionalTemplate = ({ data }) => (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl">
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        <div className="text-sm text-gray-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span> | {data.phone}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between">
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
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10" />
            AI Resume Generator
          </h1>
          <p className="text-purple-200">Upload your Word document and let AI create a professional resume</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6 justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-white text-purple-900' : 'bg-purple-700 text-white'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              <span className="text-white text-sm">
                {s === 1 ? 'Upload' : s === 2 ? 'Choose Template' : 'Generate'}
              </span>
              {s < 3 && <div className="w-12 h-0.5 bg-purple-700"></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="max-w-md mx-auto">
              <label className="block w-full">
                <div className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}>
                  {isProcessing ? (
                    <div className="space-y-4">
                      <Loader2 className="w-16 h-16 mx-auto text-purple-600 animate-spin" />
                      <p className="text-lg font-medium text-gray-700">Processing your document...</p>
                      <p className="text-sm text-gray-500">AI is analyzing your resume</p>
                    </div>
                  ) : file ? (
                    <div className="space-y-4">
                      <FileText className="w-16 h-16 mx-auto text-green-600" />
                      <p className="text-lg font-medium text-gray-700">{file.name}</p>
                      <p className="text-sm text-gray-500">File uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 mx-auto text-gray-400" />
                      <p className="text-lg font-medium text-gray-700">Upload your Word document</p>
                      <p className="text-sm text-gray-500">Drop your .docx file here or click to browse</p>
                      <p className="text-xs text-gray-400">Supported: .doc, .docx</p>
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

        {step === 2 && parsedData && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`${template.color} rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 ${
                    selectedTemplate === template.id ? 'ring-4 ring-white shadow-2xl' : ''
                  }`}
                >
                  <div className="text-white text-center">
                    <div className="w-12 h-16 bg-white/20 rounded mx-auto mb-3"></div>
                    <p className="font-bold">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">✨ AI Extracted Information:</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><strong>Name:</strong> {parsedData.name}</div>
                  <div><strong>Email:</strong> {parsedData.email || 'Not found'}</div>
                  <div><strong>Phone:</strong> {parsedData.phone || 'Not found'}</div>
                  <div><strong>Skills:</strong> {parsedData.skills?.length || 0} found</div>
                </div>
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="mt-3">
                    <strong className="text-sm">Skills: </strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {parsedData.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={generateResume}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Resume
            </button>
          </div>
        )}

        {step === 3 && parsedData && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Resume</h2>
                <button
                  onClick={downloadResume}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
              
              <div id="resume-preview" className="bg-gray-100 p-6 rounded-lg overflow-auto max-h-screen">
                {selectedTemplate === 'modern' && <ModernTemplate data={parsedData} />}
                {selectedTemplate === 'professional' && <ProfessionalTemplate data={parsedData} />}
                {selectedTemplate === 'creative' && <ModernTemplate data={parsedData} />}
                {selectedTemplate === 'minimal' && <ProfessionalTemplate data={parsedData} />}
              </div>
            </div>

            <button
              onClick={resetApp}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Create Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}