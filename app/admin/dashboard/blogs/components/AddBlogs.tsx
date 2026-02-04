'use client'

import React, { useState, useRef } from 'react'

export default function AddBlogs() { 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(''); 
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Draft');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleFinalConfirm = () => {
    const newBlog = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      content: content.trim(),
      status: status,
      readingTime: Math.ceil(content.split(' ').length / 200) || 1,
      image: selectedImage,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('blog_data_v2') || '[]');
      localStorage.setItem('blog_data_v2', JSON.stringify([newBlog, ...existing]));
      finishSave();
    } catch (e) {
      const existing = JSON.parse(localStorage.getItem('blog_data_v2') || '[]');
      localStorage.setItem('blog_data_v2', JSON.stringify([{ ...newBlog, image: null }, ...existing]));
      finishSave();
    }
  };

  const finishSave = () => {
    setTitle(''); setContent(''); setAuthor(''); setSelectedImage(null);
    setShowConfirmModal(false); setShowSuccessModal(true);
  };

  const cardShadow = { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' };

  return ( 
    <div className="flex flex-col items-start justify-start p-8 space-y-6 min-h-screen bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none !important; font-weight: 400 !important; }
        input, textarea { 
          color: #1a202c !important; 
          background-color: transparent !important; 
          border: none !important; 
          outline: none !important;
          box-shadow: none !important;
        }
        input::placeholder, textarea::placeholder { color: #a0aec0 !important; }
      `}</style>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg mb-2 text-gray-900">Success!</h3>
            <p className="text-gray-500 text-[11px] mb-6">Your Blog Has Been Published To The Library.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 bg-[#800000] text-white rounded-xl text-[10px]">Close</button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 max-w-sm w-full mx-4 text-center shadow-2xl">
            <h3 className="text-gray-900 text-lg mb-2">Confirm Publication?</h3>
            <p className="text-gray-500 text-[11px] mb-6">Your Blog Post Will Be Stored In Your Library.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 text-[10px] bg-gray-100 text-gray-600 rounded-xl">Cancel</button>
              <button onClick={handleFinalConfirm} className="flex-1 py-3 text-[10px] bg-[#800000] text-white rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 px-2">
        <h2 className="text-xl leading-none tracking-tight text-[#4a5565]">
          Blog Editorial
        </h2>
        <p className="text-[11px] tracking-wide italic text-gray-400">
          Create And Manage Your Stories — Your Voice Defines The Brand.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div style={cardShadow} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col flex-grow">
            <h4 className="text-gray-800 text-sm tracking-tight text-left">Project Header Image</h4>
            <p className="text-[10px] text-gray-400 mb-4 text-left">Upload Featured Project Photo</p>
            
            <div onClick={triggerBrowse} className="w-full flex-grow border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative overflow-hidden transition-all group min-h-[200px]">
              {isCompressing ? (
                <span className="text-[10px] text-[#800000] animate-pulse tracking-widest">Optimizing...</span>
              ) : selectedImage ? (
                <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <div className="bg-white p-2 rounded-full shadow-md inline-block mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  </div>
                  <p className="text-[9px] text-gray-400 tracking-widest">Upload Photo</p>
                </div>
              )}
              <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <div style={cardShadow} className="bg-white p-6 rounded-[2.5rem] border border-gray-100">
            <h4 className="text-gray-800 text-sm tracking-tight text-left">Publishing Options</h4>
            <p className="text-[10px] text-gray-400 mb-4 text-left">Set Visibility And Status</p>
            
            <div className="flex flex-col gap-1.5">
              {['Draft', 'Published', 'Scheduled'].map(s => (
                <button key={s} onClick={() => setStatus(s)} className={`w-full p-3 rounded-xl text-[10px] text-left transition-all ${status === s ? 'bg-[#800000] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div style={cardShadow} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 flex flex-col h-full">
            <div className="flex-grow space-y-4">
              <div>
                <h4 className="text-gray-800 text-sm tracking-tight text-left">Content Editorial</h4>
                <p className="text-[10px] text-gray-400 mb-6 text-left">Draft And Refine Your Masterpiece Here</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-100">
                      <label className="text-[9px] text-gray-400 mb-1 block tracking-widest ml-1">Blog Headline</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter Headline..." className="w-full p-4 text-[11px] outline-none" />
                    </div>

                    <div className="border-b border-gray-100">
                      <label className="text-[9px] text-gray-400 mb-1 block tracking-widest ml-1">Author Credit</label>
                      <input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" placeholder="Enter Author Name..." className="w-full p-4 text-[11px] outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-[9px] text-gray-400 block tracking-widest ml-1">Main Story</label>
                      <span className="text-[8px] text-[#800000] mr-1">
                        Est. {Math.ceil(content.split(' ').length / 200)} Min Read
                      </span>
                    </div>
                    <textarea 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Tell Your Story..." 
                      className="w-full p-5 text-[11px] outline-none resize-none leading-relaxed overflow-y-auto flex-grow" 
                      style={{ minHeight: '350px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 italic">Review Your Entry Before Finalizing.</p>
              <button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={!title || !content || !author || isCompressing} 
                className={`px-10 py-3 text-[10px] rounded-xl transition-all ${title && content && author ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                Save Blog Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}