'use client'
 
import React, { useState, useRef } from 'react'

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
      formData.append('allMainCategories', JSON.stringify(mainCategories));
      formData.append('allSubcategories', JSON.stringify(subcategories));
      
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
 
  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
 
  const getstatuscolor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-[#800000]';
      case 'scheduled': return 'bg-orange-400';
      case 'draft': return 'bg-rose-400';
      default: return 'bg-gray-100';
    }
  };

  const cardShadow = { 
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.05)' 
  };
 
  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-3 rounded-xl transition-all ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              style={cardShadow}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Edit Blog
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Update your blog content
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl transition-all ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            style={cardShadow}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className={`rounded-3xl p-8 transition-all ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`} style={cardShadow}>
          <form onSubmit={handlesubmit}>
            {/* Featured Image */}
            <div className="mb-8">
              <label className={`text-[8px] mb-4 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>FEATURED IMAGE</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {previewImage && (
                    <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-[#800000]/20 mb-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={fileref}
                    type="file"
                    accept="image/*"
                    onChange={handleimagechange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileref.current?.click()}
                    className={`w-full py-3 px-4 border-2 border-dashed rounded-2xl transition-all flex items-center justify-center gap-3 ${
                      isDarkMode 
                        ? 'border-gray-700 hover:border-[#800000] bg-gray-800/50 text-gray-400 hover:text-gray-200' 
                        : 'border-gray-300 hover:border-[#800000] bg-gray-50 text-gray-600 hover:text-gray-800'
                    } cursor-pointer`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Change Image</span>
                  </button>
                </div>

                {/* Blog Info Card */}
                <div className={`h-64 rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}>
                  <h4 className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Post Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Current Status</label>
                      <span className={`${getstatuscolor(status)} px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase inline-block`}>
                        {status}
                      </span>
                    </div>

                    <div>
                      <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Reading Time</label>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {Math.ceil(getTotalWordCount() / 200) || 1} min read
                      </p>
                    </div>

                    <div>
                      <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Created</label>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>BLOG TITLE</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                  />
                </div>

                {/* Author */}
                <div>
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>AUTHOR NAME</label>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    type="text"
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                  />
                </div>

                {/* Categories */}
                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>MAIN CATEGORIES</label>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} shadow-sm`}>
                    <div className="space-y-2">
                      {Object.values(MAIN_CATEGORIES).map(category => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={mainCategories.includes(category)}
                            onChange={() => handleMainCategoryToggle(category)}
                            className="w-4 h-4 text-[#800000] rounded focus:ring-[#800000]"
                          />
                          <span className={`text-[11px] transition-colors ${
                            mainCategories.includes(category)
                              ? 'text-[#800000] font-semibold'
                              : isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SUBCATEGORIES</label>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} shadow-sm min-h-[180px]`}>
                    {mainCategories.length === 0 ? (
                      <p className={`text-[10px] text-center ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} py-8`}>
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
                                : isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'
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
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SHORT DESCRIPTION</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all resize-none ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 placeholder-gray-600 focus:border-[#800000]' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400 focus:bg-white focus:border-[#800000]'
                    } border shadow-sm`}
                    rows={3}
                  />
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all appearance-none cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
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
                    <label className={`text-[8px] mb-2 block tracking-widest ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SCHEDULED DATE</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-[11px] outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-300 border-gray-700 focus:border-[#800000]' 
                          : 'bg-gray-50 text-gray-800 border-gray-200 focus:bg-white focus:border-[#800000]'
                      } border shadow-sm`}
                    />
                  </div>
                )}

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
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all ${
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
                          className={`w-full p-3 rounded-xl text-[10px] outline-none transition-all resize-none ${
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
                  type="button"
                  onClick={onClose}
                  className={`px-8 py-3 text-[10px] rounded-2xl transition-all uppercase tracking-wider ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-750' 
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