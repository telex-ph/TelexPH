'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'

export default function Careers() { 
  const [isediting, setisediting] = useState(false);
  const [searchquery, setsearchquery] = useState('');
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid');
  const [editingid, seteditingid] = useState<number | null>(null);
  const fileref = useRef<HTMLInputElement>(null);
  
  const [currentpage, setcurrentpage] = useState(1);
  const itemsperpage = 6;

  const [hasloaded, sethasloaded] = useState(false);

  const [formdata, setformdata] = useState({
    title: '',
    location: '',
    category: 'Information Technology',
    type: 'Full-time',
    salary: 'Competitive',
    summary: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'Published',
    image: null as string | null
  });

  const [records, setrecords] = useState<any[]>([]);

  const opendb = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('CareerDB', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('careers')) {
          db.createObjectStore('careers', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const savedata = async (data: any[]) => {
    const db = await opendb();
    const tx = db.transaction('careers', 'readwrite');
    const store = tx.objectStore('careers');
    store.put({ id: 'main_list', content: JSON.stringify(data) });
  };

  const getdata = async () => {
    const db = await opendb();
    return new Promise<string | null>((resolve) => {
      const tx = db.transaction('careers', 'readonly');
      const store = tx.objectStore('careers');
      const request = store.get('main_list');
      request.onsuccess = () => resolve(request.result?.content || null);
      request.onerror = () => resolve(null);
    });
  };

  useEffect(() => {
    const init = async () => {
      const saved = await getdata();
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setrecords(parsed.map((r: any) => ({ ...r, date: new Date(r.date) })));
        } catch (e) { 
          console.error("error parsing data"); 
        }
      }
      sethasloaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (hasloaded) {
      savedata(records);
    }
  }, [records, hasloaded]);

  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setformdata({ ...formdata, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const triggerbrowse = () => fileref.current?.click();

  const handlesave = () => {
    const newrecord = {
      ...formdata,
      id: editingid || Date.now(),
      date: new Date()
    };
    if (editingid !== null) {
      setrecords(prev => prev.map(r => r.id === editingid ? newrecord : r));
    } else {
      setrecords(prev => [newrecord, ...prev]);
    }
    setisediting(false);
    resetform();
  };

  const resetform = () => {
    setformdata({
      title: '', location: '', category: 'Information Technology', type: 'Full-time',
      salary: 'Competitive', summary: '', description: '', requirements: '', benefits: '', status: 'Published', image: null
    });
    seteditingid(null);
  };

  const handleedit = (rec: any) => {
    seteditingid(rec.id);
    setformdata(rec);
    setisediting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handledelete = (id: number) => {
    if(confirm("are you sure you want to delete this job posting?")) {
      setrecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredrecords = useMemo(() => {
    return records.filter(r => r.title.toLowerCase().includes(searchquery.toLowerCase()));
  }, [records, searchquery]);

  const totalitems = filteredrecords.length;
  const totalpages = Math.ceil(totalitems / itemsperpage);
  const startindex = (currentpage - 1) * itemsperpage;
  const endindex = Math.min(startindex + itemsperpage, totalitems);
  
  const currentrecords = useMemo(() => {
    return filteredrecords.slice(startindex, startindex + itemsperpage);
  }, [filteredrecords, startindex]);

  useEffect(() => {
    setcurrentpage(1);
  }, [searchquery]);

  const gettypecolor = (type: string) => {
    switch(type) {
      case 'Full-time': return { backgroundColor: '#800000' };
      case 'Part-time': return { backgroundColor: '#ff4500' };
      case 'Contract': return { backgroundColor: '#ca8a04' };
      default: return { backgroundColor: '#6b7280' };
    }
  };

  const extradeepshadow = { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' };

  if (isediting) {
    return (
      <div className="flex flex-col items-start justify-start p-8 space-y-6 min-h-screen bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
          input, textarea, select { 
            background-color: #f9fafb !important; 
            border: none !important; 
            outline: none !important;
            box-shadow: none !important;
          }
          input:focus, textarea:focus, select:focus {
            ring: 0 !important;
            outline: 2px solid #800000 !important;
          }
        `}</style>

        <div className="space-y-2 px-2">
          <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: '#4a5565' }}>Job Configuration</h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">Modify the career details and recruitment requirements.</p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col gap-6">
            <div style={extradeepshadow} className="bg-white p-6 rounded-2xl border border-gray-50 h-[260px] flex flex-col justify-center">
              <h4 className="text-gray-800 text-sm font-bold tracking-tight">Career Banner Image</h4>
              <p className="text-[10px] text-gray-400 mb-4 uppercase font-bold">Upload job featured photo</p>
              <div onClick={triggerbrowse} className="border-2 border-dashed border-gray-100 rounded-xl py-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100 cursor-pointer relative overflow-hidden transition-all flex-grow">
                {formdata.image ? (
                  <img src={formdata.image} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gray-300"><path d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z" fill="currentColor"/><path d="M13 2V9H20" fill="currentColor" opacity="0.3"/></svg>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Choose a file</p>
                  </div>
                )}
                <input type="file" ref={fileref} onChange={handlefilechange} accept="image/*" className="hidden" />
              </div>
            </div>

            <div style={extradeepshadow} className="bg-white p-6 rounded-2xl border border-gray-50 flex flex-col">
              <h4 className="text-gray-800 text-sm font-bold tracking-tight">General Information</h4>
              <p className="text-[10px] text-gray-400 mb-6 uppercase font-bold">Detailed analysis and records</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">job title</label><input value={formdata.title} onChange={(e) => setformdata({...formdata, title: e.target.value})} type="text" placeholder="enter title..." className="w-full p-3 rounded-xl text-[12px] text-gray-800" /></div>
                  <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">location</label><input value={formdata.location} onChange={(e) => setformdata({...formdata, location: e.target.value})} type="text" placeholder="remote / office" className="w-full p-3 rounded-xl text-[12px] text-gray-800" /></div>
                  <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">category</label><select value={formdata.category} onChange={(e) => setformdata({...formdata, category: e.target.value})} className="w-full p-3 rounded-xl text-[12px] text-gray-800 cursor-pointer"><option>Information Technology</option><option>Operations</option><option>Human Resource</option></select></div>
                  <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">employment type</label><select value={formdata.type} onChange={(e) => setformdata({...formdata, type: e.target.value})} className="w-full p-3 rounded-xl text-[12px] text-gray-800 cursor-pointer"><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                  <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">salary range</label><input value={formdata.salary} onChange={(e) => setformdata({...formdata, salary: e.target.value})} type="text" placeholder="competitive" className="w-full p-3 rounded-xl text-[12px] text-gray-800" /></div>
                </div>
                <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">job summary</label><textarea value={formdata.summary} onChange={(e) => setformdata({...formdata, summary: e.target.value})} rows={2} placeholder="enter summary..." className="w-full p-3 rounded-xl text-[12px] text-gray-800 outline-none resize-none" /></div>
              </div>
            </div>
          </div>

          <div style={extradeepshadow} className="bg-white p-6 rounded-2xl border border-gray-50 flex flex-col">
            <h4 className="text-gray-800 text-sm font-bold tracking-tight">Requirement Details</h4>
            <p className="text-[10px] text-gray-400 mb-6 uppercase font-bold">Technical and cultural fit</p>
            <div className="space-y-4 flex-grow">
              <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">Description</label><textarea value={formdata.description} onChange={(e) => setformdata({...formdata, description: e.target.value})} rows={3} placeholder="enter description..." className="w-full p-3 rounded-xl text-[12px] text-gray-800 outline-none resize-none" /></div>
              <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">Requirements</label><textarea value={formdata.requirements} onChange={(e) => setformdata({...formdata, requirements: e.target.value})} rows={3} placeholder="enter requirements..." className="w-full p-3 rounded-xl text-[12px] text-gray-800 outline-none resize-none" /></div>
              <div><label className="text-[10px] text-gray-400 mb-1.5 block font-bold uppercase">Benefits & perks</label><textarea value={formdata.benefits} onChange={(e) => setformdata({...formdata, benefits: e.target.value})} rows={2} placeholder="enter benefits..." className="w-full p-3 rounded-xl text-[12px] text-gray-800 outline-none resize-none" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 mt-6">
              <button onClick={() => { setisediting(false); resetform(); }} className="px-6 py-2.5 text-[10px] bg-gray-100 text-gray-500 rounded-xl font-bold uppercase tracking-widest">Discard</button>
              <button onClick={handlesave} className="px-8 py-2.5 text-[11px] bg-[#800000] text-white rounded-xl shadow-md font-bold hover:bg-[#600000] transition-all">Confirm & Publish</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return ( 
    <div className="flex flex-col items-start justify-start p-8 space-y-6 min-h-screen bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
      `}</style>

      <div className="w-full flex justify-between items-end px-2">
        <div className="space-y-2">
          <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: '#4a5565' }}>Career Opportunities</h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">Reviewing recruitment progress — your contributions are shaping meaningful solutions!</p>
        </div>
        <button onClick={() => setisediting(true)} className="px-8 py-4 bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-md hover:bg-[#600000] transition-all">
          Add new position
        </button>
      </div>

      <div className="w-full mt-10">
        <div className="px-2 mb-8 flex justify-between items-center">
          <div>
            <h4 className="text-gray-800 text-sm font-bold tracking-tight">Active Vacancies</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold">All registered career records</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-white rounded-full px-6 py-2.5 w-64 shadow-sm border border-gray-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="search positions..." 
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className="bg-transparent border-none text-[10px] outline-none w-full text-gray-800 ml-3 placeholder:text-gray-400"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
              />
            </div>
            <div className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm flex items-center">
              <button onClick={() => setviewmode('grid')} className={`p-2.5 rounded-xl transition-all ${viewmode === 'grid' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button onClick={() => setviewmode('list')} className={`p-2.5 rounded-xl transition-all ${viewmode === 'list' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>

        {currentrecords.length === 0 ? (
          <div style={extradeepshadow} className="bg-white p-20 rounded-2xl text-center border border-gray-50">
            <p className="text-[11px] text-gray-300 tracking-widest uppercase font-bold italic">no records found</p>
          </div>
        ) : (
          <>
            <div className={viewmode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
              {currentrecords.map((rec) => (
                viewmode === 'grid' ? (
                  <div key={rec.id} style={extradeepshadow} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all bg-white flex flex-col relative overflow-hidden hover:-translate-y-1.5 duration-300">
                    {rec.image && (
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-4 shadow-sm">
                        <img src={rec.image} className="w-full h-full object-cover" alt="career" />
                      </div>
                    )}
                    <span className="text-[9px] font-bold text-gray-400 mb-2 tracking-widest uppercase">{rec.category}</span>
                    
                    <div className="flex flex-col space-y-0.5">
                      <h4 className="text-[18px] text-gray-900 font-bold leading-tight line-clamp-2 uppercase">{rec.title}</h4>
                      <p className="text-[11px] text-gray-400 font-bold tracking-wide uppercase">{rec.location}</p>
                      <p className="text-[11px] text-gray-500">salary: <span className="font-bold text-[#800000]">{rec.salary}</span></p>
                    </div>

                    <div className="mt-3 mb-6">
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed text-left">
                        {rec.summary}
                      </p>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
                      <span style={gettypecolor(rec.type)} className="text-[9px] px-4 py-1.5 rounded-lg font-bold text-white shadow-sm uppercase">
                        {rec.type}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleedit(rec)} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-[#800000] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button onClick={() => handledelete(rec.id)} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-red-600 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={rec.id} style={extradeepshadow} className="group bg-white border border-gray-50 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 transition-all hover:-translate-y-1 duration-300">
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-inner bg-gray-50">
                      {rec.image ? (
                        <img src={rec.image} className="w-full h-full object-cover" alt="career" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow space-y-1 text-center md:text-left">
                      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                        <span className="text-[9px] font-bold text-[#800000] tracking-widest uppercase bg-maroon-50 px-2.5 py-1 rounded-full border border-maroon-100">{rec.category}</span>
                        <span style={gettypecolor(rec.type)} className="text-[9px] font-bold text-white tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
                          {rec.type}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <h4 className="text-md text-gray-900 font-bold leading-tight uppercase">{rec.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{rec.location}</p>
                        <p className="text-[10px] text-gray-500">salary: <span className="font-bold text-[#800000]">{rec.salary}</span></p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 text-left">{rec.summary}</p>
                    </div>
                    <div className="flex md:flex-col items-center gap-2 md:border-l md:border-gray-50 md:pl-6">
                      <button onClick={() => handleedit(rec)} className="px-5 py-2 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#800000] hover:text-white transition-all">edit</button>
                      <button onClick={() => handledelete(rec.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-600 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="w-full flex justify-end items-center mt-12 px-2 pb-10 gap-8">
              <div className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
                {startindex + 1} - {endindex} Of {totalitems} Entries
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentpage === 1}
                  onClick={() => setcurrentpage(prev => prev - 1)}
                  className={`p-2 transition-all ${currentpage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#800000]'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalpages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setcurrentpage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all border ${currentpage === i + 1 ? 'bg-transparent border-[#800000] text-[#800000]' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentpage === totalpages || totalitems === 0}
                  onClick={() => setcurrentpage(prev => prev + 1)}
                  className={`p-2 transition-all ${(currentpage === totalpages || totalitems === 0) ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#800000]'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}