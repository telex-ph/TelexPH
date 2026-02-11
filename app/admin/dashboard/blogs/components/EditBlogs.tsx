'use client'
 
import React, { useState, useRef } from 'react'
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
 
interface EditBlogsProps {
  blog: any;
  onClose: () => void;
  onSave: () => void;
}
 
export default function EditBlogs({ blog, onClose, onSave }: EditBlogsProps) {
  const [title, setTitle] = useState(blog.title || '');
  const [authorName, setAuthorName] = useState(blog.author || '');
  const [mainCategories, setMainCategories] = useState<string[]>(
    blog.mainCategory ? [blog.mainCategory] : []
  );
  const [subcategories, setSubcategories] = useState<string[]>(
    blog.subcategory ? [blog.subcategory] : []
  );
  const [shortDescription, setShortDescription] = useState(blog.shortDescription || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(blog.status || 'draft');
  const [scheduledDate, setScheduledDate] = useState(
    blog.scheduledDate ? new Date(blog.scheduledDate).toISOString().slice(0, 16) : ''
  );
  
  // Use dark mode from layout context
  const { isdarkmode } = useDarkMode();
  
  const fileref = useRef<HTMLInputElement>(null);
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

  const handleMainCategoryToggle = (category: string) => {
    setMainCategories(prev => {
      if (prev.includes(category)) {
        const updated = prev.filter(c => c !== category);
        const categorySubcats = SUBCATEGORIES[category as keyof typeof SUBCATEGORIES] || [];
        setSubcategories(prevSubs => prevSubs.filter(sub => !categorySubcats.includes(sub)));
        return updated;
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(s => s !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  const getAvailableSubcategories = () => {
    return mainCategories.flatMap(category => 
      SUBCATEGORIES[category as keyof typeof SUBCATEGORIES] || []
    );
  };

  const getTotalWordCount = () => {
    return contentSections.reduce((total, section) => {
      const sectionWords = (section.title + ' ' + section.content).split(/\s+/).filter(Boolean).length;
      return total + sectionWords;
    }, 0);
  };
 
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Add basic fields
      if (title !== blog.title) formData.append('title', title.trim());
      if (authorName !== blog.author) formData.append('author', authorName.trim());
      if (mainCategories[0] !== blog.mainCategory) formData.append('mainCategory', mainCategories[0] || '');
      if (subcategories[0] !== blog.subcategory) formData.append('subcategory', subcategories[0] || '');
      if (shortDescription !== blog.shortDescription) formData.append('shortDescription', shortDescription.trim());
      if (status !== blog.status) formData.append('status', status);
      
      // Add categories arrays
      formData.append('mainCategories', JSON.stringify(mainCategories));
      formData.append('subcategories', JSON.stringify(subcategories));
      
      // ✅ FIX: Properly stringify mainContent
      const validContentSections = contentSections.filter(section => 
        section.title.trim() || section.content.trim()
      );
      formData.append('mainContent', JSON.stringify(validContentSections));
      
      if (status === 'scheduled' && scheduledDate) {
        formData.append('scheduledDate', new Date(scheduledDate).toISOString());
      }
      
      // Add file if selected
      if (selectedFile) {
        formData.append('picture', selectedFile);
      }

      const response = await fetch(`http://localhost:3000/api/blogs/${blog._id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }

      alert('Blog updated successfully!');
      onSave(); // Refresh the blog list
      onClose();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert(error instanceof Error ? error.message : 'Failed to update blog');
    }
  };

  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-3xl max-w-6xl w-full shadow-2xl my-8 transition-colors duration-300`}>
        {/* Header */}
        <div className={`sticky top-0 ${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border-b px-8 py-6 rounded-t-3xl flex items-center justify-between z-10`}>
          <div>
            <h2 className={`text-2xl font-bold ${isdarkmode ? 'text-gray-100' : 'text-gray-900'}`}>Edit Blog Post</h2>
            <p className={`text-sm mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>Make changes to your article</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${isdarkmode ? 'hover:bg-[#252525] text-gray-400' : 'hover:bg-gray-100 text-gray-600'} rounded-full transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handlesubmit}>
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className={`text-[9px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>FEATURED IMAGE</label>
                <div 
                  onClick={() => fileref.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    isdarkmode 
                      ? 'border-white/10 hover:border-white/10 bg-[#252525]/30' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                  style={{ aspectRatio: '16/9' }}
                >
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Click to change image</p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                        <svg className={`w-8 h-8 ${isdarkmode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload</p>
                        <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileref}
                  type="file"
                  accept="image/*"
                  onChange={handlefilechange}
                  className="hidden"
                />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>BLOG TITLE</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                      isdarkmode 
                        ? 'bg-[#252525] text-gray-300 border-white/10 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Author */}
                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>AUTHOR NAME</label>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    type="text"
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                      isdarkmode 
                        ? 'bg-[#252525] text-gray-300 border-white/10 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                    placeholder="Enter author name..."
                  />
                </div>

                {/* Main Categories */}
                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>MAIN CATEGORIES</label>
                  <div className={`p-4 rounded-2xl border ${isdarkmode ? 'bg-[#252525] border-white/10' : 'bg-gray-50 border-gray-200'} shadow-sm space-y-2`}>
                    {Object.values(MAIN_CATEGORIES).map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={mainCategories.includes(cat)}
                          onChange={() => handleMainCategoryToggle(cat)}
                          className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                        />
                        <span className={`text-[11px] transition-colors ${
                          mainCategories.includes(cat)
                            ? 'text-[#800000] font-semibold'
                            : isdarkmode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                <div className="col-span-2">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>SUBCATEGORIES</label>
                  <div className={`p-4 rounded-2xl border ${isdarkmode ? 'bg-[#252525] border-white/10' : 'bg-gray-50 border-gray-200'} shadow-sm min-h-[180px]`}>
                    {mainCategories.length === 0 ? (
                      <p className={`text-[10px] text-center ${isdarkmode ? 'text-gray-600' : 'text-gray-400'} py-8`}>
                        Select a main category first
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {getAvailableSubcategories().map(subcat => (
                          <label key={subcat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={subcategories.includes(subcat)}
                              onChange={() => handleSubcategoryToggle(subcat)}
                              className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                            />
                            <span className={`text-[11px] transition-colors ${
                              subcategories.includes(subcat)
                                ? 'text-[#800000] font-semibold'
                                : isdarkmode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                              {subcat}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div className="col-span-2">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>SHORT DESCRIPTION</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all resize-none ${
                      isdarkmode 
                        ? 'bg-[#252525] text-gray-300 border-white/10 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                    rows={3}
                  />
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all appearance-none cursor-pointer ${
                      isdarkmode 
                        ? 'bg-[#252525] text-gray-300 border-white/10 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {status === 'scheduled' && (
                  <div className="col-span-1">
                    <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>SCHEDULED DATE</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                        isdarkmode 
                          ? 'bg-[#252525] text-gray-300 border-white/10 focus:border-[#800000]' 
                          : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                      } border shadow-sm`}
                    />
                  </div>
                )}

                {/* Content Sections */}
                <div className="col-span-2 space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className={`text-[8px] tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>CONTENT SECTIONS</label>
                    <span className="text-[8px] text-[#800000] font-bold">
                      Est. {Math.ceil(getTotalWordCount() / 200) || 1} Min Read
                    </span>
                  </div>

                  {contentSections.map((section, index) => (
                    <div key={index} className={`border rounded-2xl p-6 space-y-4 relative ${
                      isdarkmode ? 'bg-[#252525]/50 border-white/10' : 'bg-gray-50/50 border-gray-200'
                    }`}>
                      {contentSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentSection(index)}
                          className={`absolute top-4 right-4 hover:text-red-600 text-[10px] rounded-full w-7 h-7 flex items-center justify-center transition-colors ${
                            isdarkmode 
                              ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                              : 'text-red-400 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          ×
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                        <label className={`text-[9px] tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-500'}`}>
                          SECTION {index + 1}
                        </label>
                      </div>

                      <div>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Section Title</label>
                        <input
                          value={section.title}
                          onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                          type="text"
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all ${
                            isdarkmode 
                              ? 'bg-[#252525] text-gray-300 border-white/10 placeholder-gray-600 focus:border-[#800000]' 
                              : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400 focus:border-[#800000]'
                          } border`}
                        />
                      </div>

                      <div>
                        <label className={`text-[8px] mb-1 block tracking-widest ml-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Section Content</label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all resize-none ${
                            isdarkmode 
                              ? 'bg-[#252525] text-gray-300 border-white/10 placeholder-gray-600 focus:border-[#800000]' 
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
                      isdarkmode 
                        ? 'border-white/10 text-gray-500 hover:border-[#800000] hover:text-[#800000]' 
                        : 'border-gray-300 text-gray-500 hover:border-[#800000] hover:text-[#800000]'
                    }`}
                  >
                    + Add Another Section
                  </button>
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-8 border-t mt-8 ${isdarkmode ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-8 py-3 text-[10px] rounded-2xl transition-all uppercase tracking-wider ${
                    isdarkmode 
                      ? 'bg-[#252525] text-gray-300 hover:bg-[#2a2a2a]' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-12 py-3 text-[10px] bg-[#800000] text-white rounded-2xl shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-all uppercase tracking-wider font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}