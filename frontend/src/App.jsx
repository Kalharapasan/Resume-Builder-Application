import React, { useState } from 'react';
import { Upload, FileText, Download, Sparkles, Loader2, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
export default function ResumeGenerator() {
    
    
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