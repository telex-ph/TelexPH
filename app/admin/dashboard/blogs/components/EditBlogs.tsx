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
 
interface EditBlogsProps {
  blog: any;
  onsave: (updatedblog: any) => void;
  oncancel: () => void;
}
 
export default function EditBlogs({ blog, onsave, oncancel }: EditBlogsProps) {
  const [editingblog, seteditingblog] = useState({ ...blog });
  const fileref = useRef<HTMLInputElement>(null);

  // ✅ FIX: Store actual File object, not base64 string
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(blog.picture || '');

  // Initialize content sections from blog data
  const [contentSections, setContentSections] = useState<ContentSection[]>(() => {
    if (blog.mainContent && Array.isArray(blog.mainContent) && blog.mainContent.length > 0) {
      return blog.mainContent.map((section: any) => ({
        title: section.title || '',
        content: section.content || ''
      }));
    }
    return [{ title: '', content: '' }];
  });

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
    seteditingblog({ 
      ...editingblog, 
      mainCategory: category,
      subcategory: '' // Reset subcategory when main category changes
    });
  };

  const getAvailableSubcategories = () => {
    return editingblog.mainCategory ? SUBCATEGORIES[editingblog.mainCategory as keyof typeof SUBCATEGORIES] || [] : [];
  };

  // Calculate total word count for reading time
  const getTotalWordCount = () => {
    return contentSections.reduce((total, section) => {
      const sectionWords = (section.title + ' ' + section.content).split(/\s+/).filter(Boolean).length;
      return total + sectionWords;
    }, 0);
  };
 
  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ FIX: Include the actual File object in updated blog
    const updatedBlog = {
      ...editingblog,
      mainContent: contentSections,
      // Pass the actual File object (not base64 string)
      pictureFile: selectedFile, // New field for the File object
    };
    
    onsave(updatedBlog);
  };
 
  // ✅ FIX: Store actual File object and create preview
  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual File object
      setSelectedFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
 
  const getstatuscolor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-[#800000]';
      case 'scheduled': return 'bg-orange-400';
      case 'draft': return 'bg-rose-400';
      default: return 'bg-gray-100';
    }
  };
 
  return (
    <div className="flex flex-col items-start justify-start p-8 space-y-8 min-h-screen bg-transparent" style={{ fontFamily: "'poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'poppins', sans-serif !important; font-weight: 400; }
        .bold-text { font-weight: 700 !important; }
        .no-capitalize { text-transform: lowercase !important; }
      `}</style>
 
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="space-y-2">
          <h2 className="text-xl leading-none tracking-tight text-gray-600">
            Edit Blog Details
          </h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">
            Reviewing your research progress — your contributions are shaping meaningful solutions!
          </p>
        </div>
      </div>
 
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
 
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[380px] flex flex-col">
          <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Post Information</h4>
          <p className="text-[10px] text-gray-400 mb-8">Real-time entry insights</p>
         
          <div className="flex-grow flex flex-col space-y-6">
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-2">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Current Status</span>
                </div>
                <div className="mt-1">
                  <span className={`${getstatuscolor(editingblog.status)} px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase`}>
                    {editingblog.status || 'Draft'}
                  </span>
                </div>
              </div>
            </div>
 
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-1">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Author</span>
                </div>
                <div className="text-[11px] mt-1">
                  <span className="text-gray-700 font-semibold">{editingblog.author || 'Unknown'}</span>
                </div>
              </div>
            </div>
 
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-1">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Created</span>
                </div>
                <div className="text-[11px] mt-1">
                  <span className="text-gray-700 font-semibold">
                    {editingblog.createdAt ? new Date(editingblog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
 
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-1">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Est. Read Time</span>
                </div>
                <div className="text-[11px] mt-1">
                  <span className="text-[#800000] font-bold">
                    {Math.ceil(getTotalWordCount() / 200) || 1} Min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <form onSubmit={handlesubmit} className="space-y-8">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-2" style={{ color: '#4a5565' }}>Cover Image</h3>
              <p className="text-[10px] text-gray-400 mb-6">Upload a featured image for your blog</p>
             
              <div className="relative">
                <input 
                  ref={fileref} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleimagechange}
                  className="hidden" 
                />
                <div 
                  onClick={() => fileref.current?.click()} 
                  className="cursor-pointer relative w-full h-64 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden hover:border-[#800000] transition-all group"
                >
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center space-y-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                          <p className="text-[10px] font-semibold">Click to change image</p>
                          {selectedFile && (
                            <p className="text-[9px] text-green-300">✓ New image selected</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <p className="text-[11px] font-semibold">Click to upload cover image</p>
                      <p className="text-[9px] mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Title</span>
                </div>
                <input
                  value={editingblog.title || ''}
                  onChange={(e) => seteditingblog({...editingblog, title: e.target.value})}
                  type="text"
                  placeholder="enter blog title..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all no-capitalize shadow-sm"
                />
              </div>

              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Author</span>
                </div>
                <input
                  value={editingblog.author || ''}
                  onChange={(e) => seteditingblog({...editingblog, author: e.target.value})}
                  type="text"
                  placeholder="enter author name..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all no-capitalize shadow-sm"
                />
              </div>

              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Status</span>
                </div>
                <div className="relative">
                  <select
                    value={editingblog.status || 'draft'}
                    onChange={(e) => seteditingblog({...editingblog, status: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none cursor-pointer focus:bg-white focus:border-[#800000] transition-all appearance-none shadow-sm"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="scheduled">scheduled</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Main Category</span>
                </div>
                <div className="relative">
                  <select
                    value={editingblog.mainCategory || ''}
                    onChange={(e) => handleMainCategoryChange(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none cursor-pointer focus:bg-white focus:border-[#800000] transition-all appearance-none shadow-sm"
                  >
                    <option value="">Select Category</option>
                    {Object.values(MAIN_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Subcategory</span>
                </div>
                <div className="relative">
                  <select
                    value={editingblog.subcategory || ''}
                    onChange={(e) => seteditingblog({...editingblog, subcategory: e.target.value})}
                    disabled={!editingblog.mainCategory}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none cursor-pointer focus:bg-white focus:border-[#800000] transition-all appearance-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {getAvailableSubcategories().map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Short Description</span>
                </div>
                <textarea
                  value={editingblog.shortDescription || ''}
                  onChange={(e) => seteditingblog({...editingblog, shortDescription: e.target.value})}
                  placeholder="enter a brief description..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all no-capitalize shadow-sm resize-none"
                  rows={3}
                />
              </div>

              {editingblog.status === 'scheduled' && (
                <div className="col-span-2">
                  <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                    <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Scheduled Date</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={editingblog.scheduledDate ? new Date(editingblog.scheduledDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => seteditingblog({...editingblog, scheduledDate: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all shadow-sm"
                  />
                </div>
              )}

              {/* Main Content Sections */}
              <div className="col-span-2 space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] w-fit border border-gray-200">
                    <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Content Sections</span>
                  </div>
                  <span className="text-[8px] text-[#800000] font-bold">
                    Est. {Math.ceil(getTotalWordCount() / 200) || 1} Min Read
                  </span>
                </div>

                {contentSections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 space-y-4 relative bg-gray-50/50">
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
                      <label className="text-[9px] tracking-widest text-gray-500">
                        SECTION {index + 1}
                      </label>
                    </div>

                    <div>
                      <label className="text-[8px] mb-1 block tracking-widest ml-1 text-gray-400">Section Title</label>
                      <input
                        value={section.title}
                        onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                        type="text"
                        placeholder="enter section title..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-[10px] text-gray-800 outline-none focus:border-[#800000] transition-all no-capitalize"
                      />
                    </div>

                    <div>
                      <label className="text-[8px] mb-1 block tracking-widest ml-1 text-gray-400">Section Content</label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                        placeholder="write your content..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-[10px] text-gray-800 outline-none focus:border-[#800000] transition-all no-capitalize resize-none"
                        rows={6}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addContentSection}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-[10px] text-gray-500 hover:border-[#800000] hover:text-[#800000] transition-all"
                >
                  + Add Another Section
                </button>
              </div>
            </div>
 
            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={oncancel}
                className="px-8 py-3 text-[10px] bg-gray-100 text-gray-500 rounded-2xl bold-text hover:bg-gray-200 transition-all uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-12 py-3 text-[10px] bg-[#800000] text-white rounded-2xl shadow-lg shadow-[#800000]/20 bold-text hover:bg-[#600000] transition-all uppercase tracking-wider"
              >
                Confirm & Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}