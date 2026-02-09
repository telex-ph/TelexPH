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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const actualFileRef = useRef<File | null>(null);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode on mount
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setIsDarkMode(darkMode);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState(''); // Changed: Direct string name
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [shortDescription, setShortDescription] = useState('');
  const [mainContentTitle, setMainContentTitle] = useState('');
  const [mainContentText, setMainContentText] = useState('');
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { title: '', content: '' }
  ]);
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      actualFileRef.current = file;
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxWidth = 800; 
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setSelectedImage(canvas.toDataURL('image/jpeg', 0.7));
            setIsCompressing(false);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBrowse = () => fileRef.current?.click();

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

  const handleMainCategoryChange = (category: string) => {
    setMainCategory(category);
    setSubcategory('');
  };

  const getAvailableSubcategories = () => {
    return mainCategory ? SUBCATEGORIES[mainCategory as keyof typeof SUBCATEGORIES] || [] : [];
  };

  const handleFinalConfirm = async () => {
    if (!actualFileRef.current) {
      setErrorMessage('Please upload an image');
      setShowConfirmModal(false);
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Build mainContent array: main content + additional sections
      const allMainContent = [];
      
      // Add the main content section first (if filled)
      if (mainContentTitle.trim() && mainContentText.trim()) {
        allMainContent.push({
          title: mainContentTitle.trim(),
          content: mainContentText.trim()
        });
      }
      
      // Add additional content sections
      contentSections.forEach(section => {
        if (section.title.trim() && section.content.trim()) {
          allMainContent.push({
            title: section.title.trim(),
            content: section.content.trim()
          });
        }
      });
      
      // Append form fields
      formData.append('title', title.trim());
      formData.append('author', authorName.trim()); // Send plain text
      formData.append('mainCategory', mainCategory);
      formData.append('subcategory', subcategory);
      formData.append('shortDescription', shortDescription.trim());
      // Important: We still send as JSON string because FormData only accepts strings/blobs.
      // The backend controller will now parse this manually.
      formData.append('mainContent', JSON.stringify(allMainContent)); 
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
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unknown error occurred');
      }
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const hasMainContent = mainContentTitle.trim() && mainContentText.trim();
    const hasValidSections = contentSections.some(section => 
      section.title.trim() && section.content.trim()
    );
    const hasAnyContent = hasMainContent || hasValidSections;
    
    const baseValid = title.trim() && authorName.trim() && mainCategory && subcategory && 
                     shortDescription.trim() && selectedImage && hasAnyContent;
    
    if (status === 'scheduled') {
      return baseValid && scheduledDate;
    }
    
    return baseValid;
  };

  const getTotalWordCount = () => {
    let count = 0;
    
    if (mainContentText.trim()) {
      count += mainContentText.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    count += contentSections.reduce((total, section) => {
      return total + section.content.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
    
    return count;
  };

  const cardShadow = {
    boxShadow: isDarkMode 
      ? '0 0 40px rgba(0,0,0,0.3)' 
      : '0 0 40px rgba(0,0,0,0.04)'
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 lg:p-10 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className={`text-xl md:text-2xl tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Create New Blog Post</h1>
        <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Share your insights with the world</p>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Confirm Publication</h3>
            <p className={`text-[11px] mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to save this blog entry? This action will {status === 'published' ? 'publish' : status === 'scheduled' ? 'schedule' : 'save as draft'} your blog.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-xl text-[10px] transition-all ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-xl text-[10px] text-white transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#800000] hover:bg-[#600000] shadow-lg shadow-[#800000]/30'}`}
              >
                {isSubmitting ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Success!</h3>
              <p className={`text-[11px] mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your blog has been {status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved as draft'} successfully.
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-3 bg-[#800000] text-white rounded-xl text-[10px] shadow-lg shadow-[#800000]/30 hover:bg-[#600000] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">✕</span>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Error</h3>
              <p className={`text-[11px] mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-wrap`}>
                {errorMessage}
              </p>
              <button 
                onClick={() => setShowErrorModal(false)}
                className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] shadow-lg hover:bg-red-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          {/* Header Image Upload */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Project Header Image</h4>
            <p className={`text-[10px] mb-4 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Upload Featured Project Photo</p>
            
            <div 
              onClick={triggerBrowse}
              className={`relative rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border-2 border-dashed`}
              style={{ aspectRatio: '16/9' }}
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
            <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Publishing Options</h4>
            <p className={`text-[10px] mb-4 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Set Visibility And Status</p>
            
            <div className="flex flex-col gap-1.5">
              {(['draft', 'published', 'scheduled'] as const).map(s => (
                <button 
                  key={s} 
                  onClick={() => setStatus(s)} 
                  className={`w-full p-3 rounded-xl text-[10px] text-left transition-all capitalize ${status === s ? 'bg-[#800000] text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {status === 'scheduled' && (
              <div className={`mt-4 pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
                <label className={`text-[9px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Schedule Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className={`w-full p-3 text-[10px] rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50'}`}
                />
              </div>
            )}
          </div>

          {/* Categories */}
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-[2.5rem] border`}>
            <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Categories</h4>
            <p className={`text-[10px] mb-4 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Organize Your Content</p>
            
            <div className="space-y-3">
              <div>
                <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Main Category</label>
                <select 
                  value={mainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  className={`w-full p-3 text-[10px] rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50'}`}
                >
                  <option value="">Select Main Category</option>
                  {Object.values(MAIN_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {mainCategory && (
                <div>
                  <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Subcategory</label>
                  <select 
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className={`w-full p-3 text-[10px] rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50'}`}
                  >
                    <option value="">Select Subcategory</option>
                    {getAvailableSubcategories().map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div style={cardShadow} className={`${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border flex flex-col h-full`}>
            <div className="flex-grow space-y-4">
              <div>
                <h4 className={`text-sm tracking-tight text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Content Editorial</h4>
                <p className={`text-[10px] mb-6 text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Draft And Refine Your Masterpiece Here</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Blog Headline</label>
                      <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        type="text" 
                        placeholder="Enter Headline..." 
                        className={`w-full p-4 text-[11px] outline-none bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                      />
                    </div>

                    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Author</label>
                      {/* CHANGED: Text Input instead of Select */}
                      <input 
                        value={authorName} 
                        onChange={(e) => setAuthorName(e.target.value)} 
                        type="text" 
                        placeholder="Enter Author Name..." 
                        className={`w-full p-4 text-[11px] outline-none bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                      />
                    </div>
                  </div>

                  <div className={`border-b pb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Short Description</label>
                    <textarea 
                      value={shortDescription} 
                      onChange={(e) => setShortDescription(e.target.value)} 
                      placeholder="Enter A Brief Description..." 
                      className={`w-full p-4 text-[11px] outline-none resize-none leading-relaxed bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                      rows={3}
                    />
                  </div>

                  {/* Main Content Section */}
                  <div className={`border rounded-2xl p-4 space-y-3 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                      <label className={`text-[9px] tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>MAIN CONTENT (Required)</label>
                    </div>
                    
                    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Main Title</label>
                      <input 
                        value={mainContentTitle} 
                        onChange={(e) => setMainContentTitle(e.target.value)} 
                        type="text" 
                        placeholder="Enter Main Content Title..." 
                        className={`w-full p-3 text-[10px] outline-none bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                      />
                    </div>

                    <div>
                      <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Main Content</label>
                      <textarea 
                        value={mainContentText} 
                        onChange={(e) => setMainContentText(e.target.value)} 
                        placeholder="Write Your Main Content..." 
                        className={`w-full p-3 text-[10px] outline-none resize-none leading-relaxed bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        rows={8}
                      />
                    </div>
                  </div>

                  {/* Additional Content Sections */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className={`text-[9px] block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Additional Sections (Optional)</label>
                      <span className="text-[8px] text-[#800000] mr-1">
                        Est. {Math.ceil(getTotalWordCount() / 200) || 1} Min Read
                      </span>
                    </div>

                    {contentSections.map((section, index) => (
                      <div key={index} className={`border rounded-2xl p-4 space-y-3 relative ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                        {contentSections.length > 1 && (
                          <button
                            onClick={() => removeContentSection(index)}
                            className={`absolute top-2 right-2 hover:text-red-600 text-[10px] rounded-full w-6 h-6 flex items-center justify-center transition-colors ${isDarkMode ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' : 'text-red-400 bg-red-50 hover:bg-red-100'}`}
                          >
                            ×
                          </button>
                        )}
                        
                        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Section Title</label>
                          <input 
                            value={section.title} 
                            onChange={(e) => updateContentSection(index, 'title', e.target.value)} 
                            type="text" 
                            placeholder="Enter Section Title..." 
                            className={`w-full p-3 text-[10px] outline-none bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                          />
                        </div>

                        <div>
                          <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Section Content</label>
                          <textarea 
                            value={section.content} 
                            onChange={(e) => updateContentSection(index, 'content', e.target.value)} 
                            placeholder="Write Your Content..." 
                            className={`w-full p-3 text-[10px] outline-none resize-none leading-relaxed bg-transparent ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                            rows={6}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addContentSection}
                      className={`w-full py-3 border-2 border-dashed rounded-xl text-[10px] transition-all ${isDarkMode ? 'border-gray-600 text-gray-500 hover:border-[#800000] hover:text-[#800000]' : 'border-gray-200 text-gray-400 hover:border-[#800000] hover:text-[#800000]'}`}
                    >
                      + Add Another Section
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex justify-between items-center pt-6 mt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
              <p className={`text-[10px] italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Review Your Entry Before Finalizing.</p>
              <button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={!isFormValid() || isSubmitting}
                className={`px-10 py-3 text-[10px] rounded-xl transition-all ${isFormValid() && !isSubmitting ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/30' : isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Blog Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}