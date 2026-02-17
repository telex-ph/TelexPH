'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDarkMode } from '../../layout' // Import the dark mode hook

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
  
  // Use dark mode from layout context
  const { isdarkmode } = useDarkMode();
  
  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
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
      
      const allMainContent = [];
      
      if (mainContentTitle.trim() || mainContentText.trim()) {
        allMainContent.push({
          title: mainContentTitle.trim(),
          content: mainContentText.trim()
        });
      }
      
      contentSections.forEach(section => {
        if (section.title.trim() || section.content.trim()) {
          allMainContent.push({
            title: section.title.trim(),
            content: section.content.trim()
          });
        }
      });
      
      formData.append('title', title.trim());
      formData.append('author', authorName.trim());
      formData.append('mainCategory', mainCategory);
      formData.append('subcategory', subcategory);
      formData.append('shortDescription', shortDescription.trim());
      formData.append('mainContent', JSON.stringify(allMainContent));
      formData.append('status', status);
      formData.append('picture', actualFileRef.current);
      
      if (status === 'scheduled' && scheduledDate) {
        formData.append('scheduledDate', new Date(scheduledDate).toISOString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog');
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);

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

    } catch (error: any) {
      console.error('Error creating blog:', error);
      setErrorMessage(error.message || 'Failed to create blog');
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      title.trim() &&
      authorName.trim() &&
      mainCategory &&
      subcategory &&
      shortDescription.trim() &&
      (mainContentTitle.trim() || mainContentText.trim()) &&
      selectedImage &&
      (status !== 'scheduled' || scheduledDate)
    );
  };

  const getTotalWordCount = () => {
    let totalWords = 0;
    
    if (mainContentTitle || mainContentText) {
      totalWords += (mainContentTitle + ' ' + mainContentText).split(/\s+/).filter(Boolean).length;
    }
    
    contentSections.forEach(section => {
      totalWords += (section.title + ' ' + section.content).split(/\s+/).filter(Boolean).length;
    });
    
    return totalWords;
  };

  const cardShadow = { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.03)' };

  return (
    <div className={`min-h-screen ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'} transition-colors duration-500`}>
      <div className="max-w-[95rem] mx-auto">
        <div className="mb-8">
          <h1 className={`bold-text ${isdarkmode ? 'text-gray-100' : 'text-gray-900'}`}>Create New Blog Post</h1>
          <p className={`mt-2 text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>Share your insights and expertise with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div style={cardShadow} className={`${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border`}>
              <h4 className={`bold-text mb-2 text-left ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>Featured Image</h4>
              <p className={`text-[10px] mb-6 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Upload A Cover Photo For Your Article</p>
              
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div 
                onClick={triggerBrowse}
                className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage 
                    ? 'border-[#800000] bg-[#800000]/5' 
                    : isdarkmode ? 'border-white/10 hover:border-white/20 bg-[#252525]' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
                style={{ aspectRatio: '16/9' }}
              >
                {isCompressing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Compressing...</div>
                  </div>
                ) : selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-medium">Click to change</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                      <svg className={`w-7 h-7 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] bold-text ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload</p>
                      <p className={`text-[9px] mt-1 ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={cardShadow} className={`${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border`}>
              <h4 className={`bold-text mb-2 text-left ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>Publishing Options</h4>
              <p className={`text-[10px] mb-6 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Control When And How Your Post Goes Live</p>
              
              <div className="space-y-4">
                <div>
                  <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full p-3 text-[10px] rounded-xl ${isdarkmode ? 'bg-[#252525] text-gray-200 border-white/10' : 'bg-gray-50 border-gray-200'} border`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {status === 'scheduled' && (
                  <div>
                    <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Schedule Date</label>
                    <input 
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={`w-full p-3 text-[10px] rounded-xl ${isdarkmode ? 'bg-[#252525] text-gray-200 border-white/10' : 'bg-gray-50 border-gray-200'} border`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={cardShadow} className={`${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border`}>
              <h4 className={`bold-text mb-2 text-left ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>Categories</h4>
              <p className={`text-[10px] mb-6 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Organize Your Content With The Right Tags</p>
              
              <div className="space-y-4">
                <div>
                  <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Main Category</label>
                  <select 
                    value={mainCategory}
                    onChange={(e) => handleMainCategoryChange(e.target.value)}
                    className={`w-full p-3 text-[10px] rounded-xl ${isdarkmode ? 'bg-[#252525] text-gray-200 border-white/10' : 'bg-gray-50 border-gray-200'} border`}
                  >
                    <option value="">Select Category</option>
                    {Object.values(MAIN_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {mainCategory && (
                  <div>
                    <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Subcategory</label>
                    <select 
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className={`w-full p-3 text-[10px] rounded-xl ${isdarkmode ? 'bg-[#252525] text-gray-200 border-white/10' : 'bg-gray-50 border-gray-200'} border`}
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
            <div style={cardShadow} className={`${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-[2.5rem] border flex flex-col h-full`}>
              <div className="flex-grow space-y-4">
                <div>
                  <h4 className={`bold-text text-left ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>Content Editorial</h4>
                  <p className={`text-[10px] mb-6 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Draft And Refine Your Masterpiece Here</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`border-b ${isdarkmode ? 'border-white/10' : 'border-gray-100'}`}>
                        <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Blog Headline</label>
                        <input 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          type="text" 
                          placeholder="Enter Headline..." 
                          className={`w-full p-4 text-[10px] outline-none bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        />
                      </div>

                      <div className={`border-b ${isdarkmode ? 'border-white/10' : 'border-gray-100'}`}>
                        <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Author</label>
                        <input 
                          value={authorName} 
                          onChange={(e) => setAuthorName(e.target.value)} 
                          type="text" 
                          placeholder="Enter Author Name..." 
                          className={`w-full p-4 text-[10px] outline-none bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        />
                      </div>
                    </div>

                    <div className={`border-b pb-4 ${isdarkmode ? 'border-white/10' : 'border-gray-100'}`}>
                      <label className={`text-[9px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Short Description</label>
                      <textarea 
                        value={shortDescription} 
                        onChange={(e) => setShortDescription(e.target.value)} 
                        placeholder="Enter A Brief Description..." 
                        className={`w-full p-4 text-[10px] outline-none resize-none leading-relaxed bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        rows={3}
                      />
                    </div>

                    <div className={`border rounded-2xl p-4 space-y-3 ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                        <label className={`text-[9px] tracking-widest ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>MAIN CONTENT (Required)</label>
                      </div>
                      
                      <div className={`border-b ${isdarkmode ? 'border-white/10' : 'border-gray-200'}`}>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Main Title</label>
                        <input 
                          value={mainContentTitle} 
                          onChange={(e) => setMainContentTitle(e.target.value)} 
                          type="text" 
                          placeholder="Enter Main Content Title..." 
                          className={`w-full p-3 text-[10px] outline-none bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Main Content</label>
                        <textarea 
                          value={mainContentText} 
                          onChange={(e) => setMainContentText(e.target.value)} 
                          placeholder="Write Your Main Content..." 
                          className={`w-full p-3 text-[10px] outline-none resize-none leading-relaxed bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                          rows={8}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className={`text-[9px] block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Additional Sections (Optional)</label>
                        <span className="text-[8px] text-[#800000] mr-1">
                          Est. {Math.ceil(getTotalWordCount() / 200) || 1} Min Read
                        </span>
                      </div>

                      {contentSections.map((section, index) => (
                        <div key={index} className={`border rounded-2xl p-4 space-y-3 relative ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
                          {contentSections.length > 1 && (
                            <button
                              onClick={() => removeContentSection(index)}
                              className={`absolute top-2 right-2 hover:text-red-600 text-[10px] rounded-full w-6 h-6 flex items-center justify-center transition-colors ${isdarkmode ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' : 'text-red-400 bg-red-50 hover:bg-red-100'}`}
                            >
                              ×
                            </button>
                          )}
                          
                          <div className={`border-b ${isdarkmode ? 'border-white/10' : 'border-gray-200'}`}>
                            <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Section Title</label>
                            <input 
                              value={section.title} 
                              onChange={(e) => updateContentSection(index, 'title', e.target.value)} 
                              type="text" 
                              placeholder="Enter Section Title..." 
                              className={`w-full p-3 text-[10px] outline-none bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                            />
                          </div>

                          <div>
                            <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Section Content</label>
                            <textarea 
                              value={section.content} 
                              onChange={(e) => updateContentSection(index, 'content', e.target.value)} 
                              placeholder="Write Your Content..." 
                              className={`w-full p-3 text-[10px] outline-none resize-none leading-relaxed bg-transparent ${isdarkmode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                              rows={6}
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={addContentSection}
                        className={`w-full py-3 border-2 border-dashed rounded-xl text-[10px] transition-all ${isdarkmode ? 'border-white/10 text-gray-500 hover:border-[#800000] hover:text-[#800000]' : 'border-gray-200 text-gray-400 hover:border-[#800000] hover:text-[#800000]'}`}
                      >
                        + Add Another Section
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between items-center pt-6 mt-4 border-t ${isdarkmode ? 'border-white/10' : 'border-gray-50'}`}>
                <p className={`text-[10px] italic ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Review Your Entry Before Finalizing.</p>
                <button 
                  onClick={() => setShowConfirmModal(true)} 
                  disabled={!isFormValid() || isSubmitting}
                  className={`px-10 py-3 text-[10px] rounded-xl transition-all ${isFormValid() && !isSubmitting ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/30' : isdarkmode ? 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Blog Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📝</div>
              <h3 className={`bold-text mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>Confirm Submission</h3>
              <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you ready to {status === 'published' ? 'publish' : status === 'scheduled' ? 'schedule' : 'save'} this blog post?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 ${isdarkmode ? 'bg-[#2a2a2a] text-gray-200 hover:bg-[#353535]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors text-[10px]`}
              >
                Cancel
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[10px] disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className={`bold-text mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>Success!</h3>
              <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your blog post has been {status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved'} successfully.
              </p>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[10px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">❌</div>
              <h3 className={`bold-text mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>Error</h3>
              <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
            
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[10px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}