'use client'

import React, { useState, useRef, useEffect } from 'react'

// Category definitions matching backend
const MAIN_CATEGORIES = {
  MAIN_SERVICE: "Main Service Categories",
  INDUSTRY_INSIGHTS: "Industry-Specific Insights",
  BUSINESS_GROWTH: "Business Growth & Strategy",
  COMPANY_CULTURE: "Company Culture & Updates"
} as const;

const SUBCATEGORIES = {
  "Main Service Categories": [
    "Customer Experience (CX)",
    "Back Office Solutions",
    "Virtual Assistance",
    "Sales & Lead Generation"
  ],
  "Industry-Specific Insights": [
    "E-commerce Support",
    "Real Estate Outsourcing",
    "Healthcare BPO",
    "Tech & SaaS Scaling"
  ],
  "Business Growth & Strategy": [
    "Scale Smarter",
    "Outsourcing 101",
    "Cost Optimization"
  ],
  "Company Culture & Updates": [
    "TelexPH Life",
    "News & Press Releases"
  ]
};

interface ContentSection {
  title: string;
  content: string;
}

export default function AddBlogs() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [mainContentTitle, setMainContentTitle] = useState('');
  const [mainContentText, setMainContentText] = useState('');
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { title: '', content: '' }
  ]);
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const actualFileRef = useRef<File | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // Create image element
      const img = new Image();
      const reader = new FileReader();
      
      await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = resolve;
          img.onerror = reject;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create canvas and compress
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setSelectedImage(canvas.toDataURL('image/jpeg', 0.7));

      // Convert canvas to blob then to File
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.7);
      });
      
      const compressedFile = new File([blob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      actualFileRef.current = compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const triggerBrowse = () => fileRef.current?.click();

  const handleMainCategoryChange = (category: string) => {
    setMainCategory(category);
    setSubcategory(''); // Reset subcategory when main category changes
  };

  const getAvailableSubcategories = () => {
    return mainCategory ? SUBCATEGORIES[mainCategory as keyof typeof SUBCATEGORIES] || [] : [];
  };

  const addContentSection = () => {
    setContentSections([...contentSections, { title: '', content: '' }]);
  };

  const removeContentSection = (index: number) => {
    if (contentSections.length > 1) {
      setContentSections(contentSections.filter((_, i) => i !== index));
    }
  };

  const updateContentSection = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...contentSections];
    updated[index][field] = value;
    setContentSections(updated);
  };

  const getTotalWordCount = () => {
    return contentSections.reduce((total, section) => {
      const sectionWords = (section.title + ' ' + section.content).split(/\s+/).filter(Boolean).length;
      return total + sectionWords;
    }, 0);
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    try {
      console.log('🚀 Starting blog submission...');
      
      if (!actualFileRef.current) {
        throw new Error('Please select an image');
      }

      const formData = new FormData();
      
      formData.append('title', title.trim());
      formData.append('author', authorName.trim());
      formData.append('mainCategory', mainCategory);
      formData.append('subcategory', subcategory);
      formData.append('shortDescription', shortDescription.trim());
      formData.append('status', status);
      
      if (status === 'scheduled' && scheduledDate) {
        formData.append('scheduledDate', new Date(scheduledDate).toISOString());
      }
      
      formData.append('picture', actualFileRef.current);

      console.log('📤 Sending request to http://localhost:3000/api/blogs');

      const response = await fetch('http://localhost:3000/api/blogs', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('❌ Error response:', errorData);
          
          if (response.status === 401 || response.status === 403) {
            throw new Error('Session expired. Please log in again.');
          }
          
          if (errorData.details) {
            const fieldErrors = errorData.details
              .map((d: any) => `${d.path.join('.')}: ${d.message}`)
              .join('\n');
            throw new Error(`Validation failed:\n${fieldErrors}`);
          }
          
          throw new Error(errorData.error || errorData.message || 'Failed to create blog');
        } else {
          throw new Error(`Server error (${response.status}). Please try again.`);
        }
      }

      const result = await response.json();
      console.log('✅ Blog created successfully:', result);
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Reset form
      setTitle('');
      setAuthorName('');
      setMainCategory('');
      setSubcategory('');
      setShortDescription('');
      setMainContentTitle('');
      setMainContentText('');
      setContentSections([{ title: '', content: '' }]);
      setStatus('draft');
      setScheduledDate('');
      setSelectedImage(null);
      actualFileRef.current = null;
      if (fileRef.current) fileRef.current.value = '';

    } catch (error: unknown) {
      console.error('❌ Error creating blog:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const cardShadow = { 
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.05)' 
  };

  const hasAnyContent = contentSections.some(section => section.title.trim() || section.content.trim());
  
  const isReadyToSubmit = title.trim() && 
                         authorName.trim() && 
                         mainCategory && 
                         subcategory && 
                         shortDescription.trim() && selectedImage && hasAnyContent;

  return (
    <div className={`flex flex-col items-start justify-start p-8 space-y-6 min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-transparent'}`} style={{ fontFamily: "'poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'poppins', sans-serif !important; font-weight: 400; }
        .bold-text { font-weight: 700 !important; }
        .no-capitalize { text-transform: lowercase !important; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="space-y-2">
          <h2 className={`text-xl leading-none tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-600'}`}>
            Create New Blog Post
          </h2>
          <p className={`text-[11px] tracking-wide italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Share insights and stories with your audience
          </p>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 rounded-xl text-[10px] transition-all ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-750' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Stats Card */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Post Statistics</h4>
            <p className={`text-[10px] mb-6 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Real-time content insights</p>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>WORDS</span>
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{getTotalWordCount()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SECTIONS</span>
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{contentSections.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>READ TIME</span>
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{Math.ceil(getTotalWordCount() / 200) || 1} MIN</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>STATUS</span>
                <span className={`text-[9px] px-3 py-1 rounded-full ${
                  status === 'published' ? 'bg-[#800000] text-white' :
                  status === 'scheduled' ? 'bg-orange-400 text-white' :
                  'bg-rose-400 text-white'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Header Image Upload - INCREASED HEIGHT */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Featured Image</h4>
            <p className={`text-[10px] mb-4 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Upload blog header photo</p>
            
            <div 
              onClick={triggerBrowse}
              className={`relative rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border-2 border-dashed h-64`}
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Compressing...</p>
                </div>
              ) : selectedImage ? (
                <div className="absolute inset-0">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px]">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} group-hover:text-[#800000] transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Upload Photo</p>
                </div>
              )}
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          </div>

          {/* Publishing Options */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Publishing</h4>
            <p className={`text-[10px] mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Schedule or publish now</p>
            
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={`w-full p-3 rounded-xl text-[10px] outline-none cursor-pointer transition-all appearance-none ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
                      : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                  } border`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'opacity-30' : 'opacity-40'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {status === 'scheduled' && (
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
                      : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                  } border`}
                />
              )}
            </div>
          </div>

          {/* Author Card */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Author</h4>
            <p className={`text-[10px] mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Who's writing this?</p>
            
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              type="text"
              placeholder="Enter author name..."
              className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all no-capitalize ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                  : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
              } border`}
            />
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-8">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitClick(); }} className="space-y-6">
            <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border flex flex-col h-full`}>
              
              <h4 className={`text-sm tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Blog Details</h4>
              <p className={`text-[10px] mb-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fill in the core information</p>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>TITLE</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Enter blog title..."
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all no-capitalize ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                  />
                </div>

                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>MAIN CATEGORY</label>
                  <div className="relative">
                    <select
                      value={mainCategory}
                      onChange={(e) => handleMainCategoryChange(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-[11px] outline-none cursor-pointer transition-all appearance-none ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
                          : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                      } border shadow-sm`}
                    >
                      <option value="">Select Category</option>
                      {Object.values(MAIN_CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'opacity-30' : 'opacity-40'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SUBCATEGORY</label>
                  <div className="relative">
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!mainCategory}
                      className={`w-full p-4 rounded-2xl text-[11px] outline-none cursor-pointer transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
                          : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                      } border shadow-sm`}
                    >
                      <option value="">Select Subcategory</option>
                      {getAvailableSubcategories().map(subcat => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'opacity-30' : 'opacity-40'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SHORT DESCRIPTION</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief summary of your blog..."
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all no-capitalize resize-none ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                    rows={3}
                  />
                </div>

                {/* Content Sections */}
                <div className="col-span-2 space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className={`text-[8px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>CONTENT SECTIONS</label>
                    <span className="text-[8px] text-[#800000] font-bold">
                      Est. {Math.ceil(getTotalWordCount() / 200) || 1} Min Read
                    </span>
                  </div>

                  {contentSections.map((section, index) => (
                    <div key={index} className={`border rounded-2xl p-6 space-y-4 relative ${
                      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/50 border-gray-200'
                    }`}>
                      {contentSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentSection(index)}
                          className="absolute top-4 right-4 hover:text-red-600 text-[10px] rounded-full w-7 h-7 flex items-center justify-center transition-colors text-red-400 bg-red-50 hover:bg-red-100"
                        >
                          ×
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                        <label className={`text-[9px] tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          SECTION {index + 1}
                        </label>
                      </div>

                      <div>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Section Title</label>
                        <input
                          value={section.title}
                          onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                          type="text"
                          placeholder="Enter section title..."
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all no-capitalize ${
                            isDarkMode 
                              ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                              : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400 focus:border-[#800000]'
                          } border`}
                        />
                      </div>

                      <div>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Section Content</label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                          placeholder="Write your content..."
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all no-capitalize resize-none ${
                            isDarkMode 
                              ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                              : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400 focus:border-[#800000]'
                          } border`}
                          rows={6}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addContentSection}
                    className={`w-full py-3 border-2 border-dashed rounded-xl text-[10px] transition-all ${
                      isDarkMode 
                        ? 'border-gray-700 text-gray-500 hover:border-[#800000] hover:text-[#800000]' 
                        : 'border-gray-300 text-gray-500 hover:border-[#800000] hover:text-[#800000]'
                    }`}
                  >
                    + Add Another Section
                  </button>
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-8 border-t mt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <button
                  type="submit"
                  disabled={!isReadyToSubmit}
                  className="px-12 py-3 text-[10px] bg-[#800000] text-white rounded-2xl shadow-lg shadow-[#800000]/20 bold-text hover:bg-[#600000] transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Blog
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Confirm Publication</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Are you ready to publish "{title}"?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className={`flex-1 px-6 py-3 rounded-xl text-sm transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-750' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-xl hover:bg-[#600000] transition-all text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-3xl p-8 max-w-md w-full shadow-2xl text-center`}>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Success!</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Your blog has been published successfully.
            </p>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-8 py-3 bg-[#800000] text-white rounded-xl hover:bg-[#600000] transition-all text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}