'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'

export default function CaseStudies() { 
  const [activetab, setactivetab] = useState('All');
  const [showconfirmmodal, setshowconfirmmodal] = useState(false);
  const [searchquery, setsearchquery] = useState('');
  const [sortby, setsortby] = useState('Newest');
  const [editingid, seteditingid] = useState<number | null>(null);
  const fileref = useRef<HTMLInputElement>(null);
  
  const [title, settitle] = useState('');
  const [author, setauthor] = useState('Maybelle Cabalar'); 
  const [description, setdescription] = useState('');
  const [challenge, setchallenge] = useState('');
  const [solution, setsolution] = useState('');
  const [result, setresult] = useState('');
  const [category, setcategory] = useState('All Case Studies');
  const [status, setstatus] = useState('Draft');
  const [startdate, setstartdate] = useState('2026-01-26');
  const [enddate, setenddate] = useState('2026-01-28');
  const [selectedimage, setselectedimage] = useState<string | null>(null);

  const today = new Date(2026, 0, 29);
  const todaystr = "2026-01-29";
  const [selectedmonthindex, setselectedmonthindex] = useState(today.getMonth());
  const [selectedday, setselectedday] = useState(today.getDate()); 

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysshort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [records, setrecords] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('casestudies_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withdates = parsed.map((r: any) => ({ ...r, date: new Date(r.date) }));
        setrecords(withdates);
      } catch (e) { console.error("Error loading data"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('casestudies_data', JSON.stringify(records));
  }, [records]);

  const authorstats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    records.forEach(r => {
      stats[r.author] = (stats[r.author] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [records]);

  const getselecteddayname = () => {
    try {
      const date = new Date(2026, selectedmonthindex, selectedday);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } catch (e) { return 'Thursday'; }
  };

  const calendardata = useMemo(() => {
    const year = 2026;
    const firstdayofmonth = new Date(year, selectedmonthindex, 1).getDay();
    const startpadding = firstdayofmonth === 0 ? 6 : firstdayofmonth - 1;
    const daysinmonth = new Date(year, selectedmonthindex + 1, 0).getDate();
    const prevmonthdays = new Date(year, selectedmonthindex, 0).getDate();
    const days = [];
    for (let i = startpadding - 1; i >= 0; i--) { days.push({ day: prevmonthdays - i, currentmonth: false, record: null, istoday: false, fullDate: '' }); }
    for (let i = 1; i <= daysinmonth; i++) {
      const datestr = `2026-${String(selectedmonthindex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const matchedrecord = records.find(r => datestr >= r.start && datestr <= r.end);
      days.push({ 
        day: i, currentmonth: true, fullDate: datestr, istoday: datestr === todaystr, record: matchedrecord,
        isstart: matchedrecord?.start === datestr, isend: matchedrecord?.end === datestr,
        isbetween: matchedrecord && datestr > matchedrecord.start && datestr < matchedrecord.end
      });
    }
    while (days.length < 42) { days.push({ day: days.length - (startpadding + daysinmonth) + 1, currentmonth: false, record: null, istoday: false, fullDate: '' }); }
    return days;
  }, [selectedmonthindex, records]);

  const getstatuscolor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-[#800000]';
      case 'Archived': return 'bg-orange-400';
      case 'Draft': return 'bg-rose-400';
      default: return 'bg-gray-100';
    }
  };

  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setselectedimage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerbrowse = () => fileref.current?.click();

  const handleinput = (e: React.ChangeEvent<HTMLTextAreaElement>, setter: (val: string) => void) => { 
    setter(e.target.value);
    e.target.style.height = 'auto'; 
    e.target.style.height = e.target.scrollHeight + 'px'; 
  }

  const handlefinalconfirm = () => {
    const newrecord = {
      id: editingid || Date.now(),
      title: title,
      author: author,
      description: description,
      challenge: challenge,
      solution: solution,
      result: result,
      status: status,
      start: startdate,
      end: enddate,
      image: selectedimage,
      date: new Date()
    };
    if (editingid !== null) {
      setrecords(prev => prev.map(r => r.id === editingid ? newrecord : r));
      seteditingid(null);
    } else {
      setrecords(prev => [newrecord, ...prev]);
    }
    settitle(''); setdescription(''); setchallenge(''); setsolution(''); setresult(''); setselectedimage(null);
    setshowconfirmmodal(false);
  };

  const handledelete = (id: number) => {
    if(confirm("Are you sure you want to delete this?")) {
      setrecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleedit = (rec: any) => {
    seteditingid(rec.id);
    settitle(rec.title);
    setauthor(rec.author);
    setdescription(rec.description);
    setchallenge(rec.challenge);
    setsolution(rec.solution);
    setresult(rec.result);
    setstatus(rec.status);
    setstartdate(rec.start);
    setenddate(rec.end);
    setselectedimage(rec.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [ 
    { name: 'All', count: records.length }, 
    { name: 'Draft', count: records.filter(r => r.status === 'Draft').length }, 
    { name: 'Published', count: records.filter(r => r.status === 'Published').length }, 
    { name: 'Archived', count: records.filter(r => r.status === 'Archived').length } 
  ]

  const filteredrecords = useMemo(() => {
    return records
      .filter(r => (activetab === 'All' || r.status === activetab) && r.title.toLowerCase().includes(searchquery.toLowerCase()))
      .sort((a, b) => {
        if (sortby === 'Title') return a.title.localeCompare(b.title);
        if (sortby === 'Newest') return b.date.getTime() - a.date.getTime();
        return a.date.getTime() - b.date.getTime();
      });
  }, [records, activetab, searchquery, sortby]);

  return ( 
    <div className="flex flex-col items-start justify-start p-8 space-y-6 min-h-screen bg-[#f8f9fa] dark:bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {showconfirmmodal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 max-w-sm w-full mx-4 text-center">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Confirm Publication?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] mb-6">Save this case study now.</p>
            <div className="flex gap-3">
              <button onClick={() => setshowconfirmmodal(false)} className="flex-1 py-3 text-[10px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl font-bold">Cancel</button>
              <button onClick={handlefinalconfirm} className="flex-1 py-3 text-[10px] bg-[#800000] text-white rounded-xl font-bold shadow-md">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 px-2">
        <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: '#4a5565' }}>
          Case Study Insights
        </h2>
        <p className="text-[11px] tracking-wide italic text-gray-400 dark:text-gray-500">
          Reviewing your research progress — your contributions are shaping meaningful solutions!
        </p>
      </div>

      <div className="w-full h-[240px] rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 relative bg-white dark:bg-transparent">
        <img 
          src="/images/study.png" 
          alt="Research Case Study" 
          className="w-full h-full object-cover object-center block"
          loading="eager"
        />
      </div>

      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-transparent p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 h-[220px] flex flex-col justify-center">
              <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Project Header Image</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4">Upload featured project photo</p>
              <div onClick={triggerbrowse} className="border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2rem] py-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer relative overflow-hidden transition-all flex-grow">
                {selectedimage ? (
                  <img src={selectedimage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                       <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-gray-600"><path d="M13 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9L13 2Z" fill="currentColor"/><path d="M13 2V9H20" fill="currentColor" opacity="0.3"/></svg>
                       <div className="absolute -bottom-1 -right-1 bg-[#800000] rounded-full p-1 border-2 border-white dark:border-transparent shadow-sm"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg></div>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Drag and drop file here or <span className="text-[#800000] font-bold underline">Choose a file</span></p>
                  </div>
                )}
                <input type="file" ref={fileref} onChange={handlefilechange} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 flex flex-col flex-grow">
              <h4 className="text-gray-800 dark:text-white text-sm font-bold tracking-tight">General Information</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-8 uppercase">Detailed Analysis And Records</p>
              <div className="space-y-6 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Case Study Title</label><input value={title} onChange={(e) => settitle(e.target.value)} type="text" placeholder="Enter Title..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none" /></div>
                  <div className="col-span-2"><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Author Name</label><input value={author} onChange={(e) => setauthor(e.target.value)} type="text" placeholder="Enter Author Name..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none" /></div>
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Status</label><select value={status} onChange={(e) => setstatus(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none cursor-pointer"><option value="Draft">Draft</option><option value="Published">Published</option><option value="Archived">Archived</option></select></div>
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Category</label><select value={category} onChange={(e) => setcategory(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none cursor-pointer"><option>All Case Studies</option><option>Events</option><option>Guides</option></select></div>
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Start Date</label><input type="date" value={startdate} onChange={(e) => setstartdate(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none" /></div>
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">End Date</label><input type="date" value={enddate} onChange={(e) => setenddate(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none" /></div>
                </div>
                <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Description</label><textarea value={description} onChange={(e: any) => handleinput(e, setdescription)} rows={1} placeholder="Enter Description..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none overflow-hidden resize-none" /></div>
                <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Challenge</label><textarea value={challenge} onChange={(e: any) => handleinput(e, setchallenge)} rows={1} placeholder="Enter Challenge..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none overflow-hidden resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Solution</label><textarea value={solution} onChange={(e: any) => handleinput(e, setsolution)} rows={1} placeholder="Enter Solution..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none overflow-hidden resize-none" /></div>
                  <div><label className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 block font-bold">Result</label><textarea value={result} onChange={(e: any) => handleinput(e, setresult)} rows={1} placeholder="Enter Result..." className="w-full p-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[12px] text-gray-800 dark:text-white outline-none overflow-hidden resize-none" /></div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5 mt-8">
                <button onClick={() => setshowconfirmmodal(true)} disabled={!title} className={`px-12 py-3 text-[11px] rounded-2xl shadow-md font-bold transition-all ${title ? 'bg-[#800000] text-white hover:bg-[#600000]' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}>Confirm & Publish</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 h-[220px]">
              <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Author & Analytics</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-6">Real-time entry insights</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', val: records.length, sub: 'Monthly' },
                  { label: 'Active', val: records.filter(r => r.status === 'Published').length, sub: 'Published' },
                  { label: 'Saved', val: records.filter(r => r.status === 'Draft').length, sub: 'Drafts' },
                  { label: 'Files', val: records.filter(r => r.status === 'Archived').length, sub: 'Archived' }
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl flex flex-col justify-center items-center border border-gray-100 dark:border-white/10 text-center">
                    <span className="text-[7.5px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase leading-tight">{s.sub}</span>
                    <span className="text-2xl font-bold text-[#800000]">{s.val}</span>
                    <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 flex flex-col">
              <h4 className="text-gray-800 dark:text-white text-sm font-bold tracking-tight">Timeline & Events</h4>
              <p className="text-[10px] text-gray-400 mb-6">Interactive Schedule Overview</p>
              <div className="flex justify-between items-center mb-4"><span className="text-gray-800 dark:text-white font-medium text-[13px] tracking-wide">{getselecteddayname()} • <span className="text-gray-400">{selectedday} {months[selectedmonthindex]}</span></span></div>
              <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar text-[10px] font-bold text-gray-400 pb-2 border-b border-gray-50 dark:border-white/5">{months.map((m, idx) => (<span key={m} onClick={() => { setselectedmonthindex(idx); setselectedday(1); }} className={`flex-shrink-0 cursor-pointer transition-all px-4 py-1.5 rounded-full whitespace-nowrap ${idx === selectedmonthindex ? 'text-white bg-[#800000] shadow-sm' : 'hover:text-gray-600 dark:hover:text-gray-300'}`}>{m}</span>))}</div>
              <div className="grid grid-cols-7 gap-y-3 text-center content-start overflow-hidden flex-grow">
                {daysshort.map(day => <span key={day} className="text-gray-400 text-[9px] font-bold mb-2 uppercase">{day}</span>)}
                {calendardata.map((d, i) => (
                  <div key={i} className="relative py-1 flex items-center justify-center h-9">
                    {d.record && <div className={`absolute h-7 w-full opacity-25 ${d.isstart ? 'rounded-l-full left-1/2 w-1/2' : ''} ${d.isend ? 'rounded-r-full right-1/2 w-1/2' : ''} ${d.isbetween ? 'w-full' : ''} ${getstatuscolor(d.record.status)}`} />}
                    <span onClick={() => d.currentmonth && setselectedday(d.day)} className={`relative z-10 w-8 h-8 flex items-center justify-center transition-all cursor-pointer rounded-full text-[13px] ${!d.currentmonth ? 'text-gray-200 dark:text-gray-800' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'} ${d.istoday ? 'border-2 border-[#800000] text-[#800000] font-bold' : ''} ${d.isstart || d.isend ? `${getstatuscolor(d.record!.status)} text-white font-bold` : ''}`}>{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-4 items-center border-t border-gray-50 dark:border-white/5 pt-4">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div><span className="text-[8px] font-bold text-gray-400 uppercase">Draft</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#800000]"></div><span className="text-[8px] font-bold text-gray-400 uppercase">Published</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div><span className="text-[8px] font-bold text-gray-400 uppercase">Archived</span></div>
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 flex flex-col flex-grow">
              <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Top Contributors</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-6">Most active publication ranking</p>
              <div className="space-y-3 flex-grow">
                {authorstats.length > 0 ? authorstats.map(([name, count], i) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/10 hover:border-[#800000]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${i === 0 ? 'bg-[#800000] text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>{i + 1}</div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-800 dark:text-white leading-none">{name}</p>
                        <p className="text-[8px] text-gray-400 dark:text-gray-500 mt-1 tracking-wider uppercase">Researcher</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#800000]">{count}</p>
                      <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase">Studies</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center opacity-30 py-8 h-full">
                     <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest text-center uppercase">No data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-0 mt-16 pb-20">
          <div className="px-2 mb-4">
            <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Case Study Library</h4>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">All registered analysis and records</p>
          </div>
          <div className="flex items-center justify-between px-2 w-full mb-1">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <div key={tab.name} onClick={() => setactivetab(tab.name)} className={`px-8 py-4 cursor-pointer text-[11px] rounded-t-[2rem] transition-all duration-300 ${activetab === tab.name ? 'bg-white dark:bg-transparent border-t border-x border-gray-100 dark:border-white/10 text-[#800000] font-bold' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>{tab.name} ({tab.count})</div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-transparent p-12 rounded-b-[4rem] rounded-tr-[4rem] shadow-sm border border-gray-100 dark:border-white/10 min-h-[400px]">
            {filteredrecords.length === 0 ? <p className="text-center text-[11px] text-gray-300 dark:text-gray-700 mt-20 tracking-widest uppercase font-bold">No records found</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredrecords.map((rec) => (
                  <div key={rec.id} className="group border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 hover:shadow-xl transition-all bg-white dark:bg-transparent flex flex-col relative overflow-hidden hover:-translate-y-2 duration-300">
                    {rec.image && (<div className="w-full h-32 rounded-[2rem] overflow-hidden mb-6 shadow-sm"><img src={rec.image} className="w-full h-full object-cover" alt="Study" /></div>)}
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-6 tracking-widest uppercase">Study Record</span>
                    <h4 className="text-[22px] text-gray-900 dark:text-white font-bold leading-tight mb-2 line-clamp-2">{rec.title}</h4>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mb-1">{rec.start} — {rec.end}</p>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">By <span className="font-bold text-[#800000]">{rec.author}</span></p>
                    <div className="mb-6 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-50 dark:border-white/10"><p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-3 italic">"{rec.description}"</p></div>
                    <div className="mt-auto flex justify-between items-center">
                      <span className={`text-[10px] px-6 py-2 rounded-2xl font-bold text-white shadow-md ${getstatuscolor(rec.status)}`}>{rec.status}</span>
                      <div className="flex gap-3">
                        <button onClick={() => handleedit(rec)} className="p-2 bg-gray-50 dark:bg-white/5 rounded-full shadow-sm text-gray-400 dark:text-gray-500 hover:text-[#800000] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button onClick={() => handledelete(rec.id)} className="p-2 bg-gray-50 dark:bg-white/5 rounded-full shadow-sm text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}