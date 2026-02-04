'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CaseStudies() { 
  const router = useRouter()
  const [activetab, setactivetab] = useState('All');
  const [showconfirmmodal, setshowconfirmmodal] = useState(false);
  const [showdeletemodal, setshowdeletemodal] = useState(false);
  const [showcalendarmodal, setshowcalendarmodal] = useState(false);
  const [showpreviewmodal, setshowpreviewmodal] = useState(false);
  const [showdatemodal, setshowdatemodal] = useState(false); // NEW: Date selection modal
  const [selecteddatedata, setselecteddatedata] = useState<any>(null); // NEW: Selected date data
  const [previewdata, setpreviewdata] = useState<any>(null);
  const [deletetarget, setdeletetarget] = useState<any>(null);
  const [searchquery, setsearchquery] = useState('');
  const [sortby, setsortby] = useState('Newest');
  const [filteredcategories, setfilteredcategories] = useState<string[]>([]); // NEW: Category filter
  const fileref = useRef<HTMLInputElement>(null);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Basic Info States
  const [title, settitle] = useState('');
  const [subtitle, setsubtitle] = useState('');
  const [author, setauthor] = useState('');
  const [challenge, setchallenge] = useState('');
  const [solution, setsolution] = useState('');
  const [result, setresult] = useState('');
  
  const [categories, setcategories] = useState<string[]>(['Technology']); 
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};
  const [status, setstatus] = useState('Active');
const [startdate, setstartdate] = useState(getCurrentDate());
const [enddate, setenddate] = useState('');
  const [isunfinished, setisunfinished] = useState(false);
  const [scheduledate, setscheduledate] = useState('2026-02-01');
  const [scheduletime, setscheduletime] = useState('09:00');
  const [selectedimage, setselectedimage] = useState<string | null>(null);
  const [selectedfile, setselectedfile] = useState<File | null>(null);

  // NEW: Time validation error
  const [timeError, setTimeError] = useState<string | null>(null);

  // New Topic & Content States (1-5)
  const [topic1, settopic1] = useState('');
  const [content1, setcontent1] = useState('');
  const [topic2, settopic2] = useState('');
  const [content2, setcontent2] = useState('');
  const [topic3, settopic3] = useState('');
  const [content3, setcontent3] = useState('');
  const [topic4, settopic4] = useState('');
  const [content4, setcontent4] = useState('');
  const [topic5, settopic5] = useState('');
  const [content5, setcontent5] = useState('');

  // Loading and error states
  const [isloading, setisloading] = useState(false);
  const [isdeleting, setisdeleting] = useState(false);
  const [error, seterror] = useState<string | null>(null);
  const [success, setsuccess] = useState<string | null>(null);

 const today = new Date();
const todaystr = today.toISOString().split('T')[0];
const [selectedmonthindex, setselectedmonthindex] = useState(today.getMonth());

  const [selectedday, setselectedday] = useState(today.getDate()); 

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysshort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Available categories
  const availableCategories = ['Technology', 'Logistics', 'Analytics', 'Infrastructure'];

  const [records, setrecords] = useState<any[]>([]);

  // NEW: Function to check and update scheduled case studies
  const checkAndUpdateScheduledStudies = async () => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

    const scheduledRecords = records.filter(r => r.status === 'Scheduled');

    for (const record of scheduledRecords) {
      if (record.scheduleDate && record.scheduleTime) {
        const scheduleDateStr = record.scheduleDate;
        const scheduleTimeStr = record.scheduleTime;

        // Check if schedule date is in the past or if it's today and time has passed
        const isPast = scheduleDateStr < currentDateStr || 
                      (scheduleDateStr === currentDateStr && scheduleTimeStr <= currentTime);

        if (isPast) {
          // Update status to Active
          try {
            const formData = new FormData();
            formData.append('status', 'active');

            const response = await fetch(`http://localhost:3000/api/casestudies/${record.id}`, {
              method: 'PATCH',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              // Update local state
              setrecords(prev => prev.map(r => r.id === record.id ? {
                ...r,
                status: 'Active'
              } : r));
            }
          } catch (error) {
            console.error('Error updating scheduled case study:', error);
          }
        }
      }
    }
  };

  // NEW: Validate schedule time
  const validateScheduleTime = (date: string, time: string): boolean => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    if (date === currentDateStr) {
      if (time <= currentTime) {
        setTimeError(`Cannot schedule for ${time} - time has already passed today. Current time is ${currentTime}.`);
        return false;
      }
    }
    
    setTimeError(null);
    return true;
  };

  // NEW: Handle schedule time change with validation
  const handleScheduleTimeChange = (newTime: string) => {
    setscheduletime(newTime);
    if (status === 'Scheduled' && scheduledate) {
      validateScheduleTime(scheduledate, newTime);
    }
  };

  // NEW: Handle schedule date change with validation
  const handleScheduleDateChange = (newDate: string) => {
    setscheduledate(newDate);
    if (status === 'Scheduled' && scheduletime) {
      validateScheduleTime(newDate, scheduletime);
    }
  };

  // Fetch case studies from backend
  const fetchCaseStudies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/casestudies', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          id: item._id,
          title: item.title,
          subtitle: item.subtitle || '',
          author: item.author || 'Unknown',
          challenge: item.challenge[0]?.text || '',
          solution: item.solution[0]?.text || '',
          result: '',
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          categories: item.tags.map((tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1)),
          start: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : todaystr),
          end: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : (item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : todaystr),
          isUnfinished: item.isUnfinished || false,
          scheduleDate: item.scheduleDate ? new Date(item.scheduleDate).toISOString().split('T')[0] : '',
          scheduleTime: item.scheduleTime || '09:00',
          image: item.cover,
          date: new Date(item.createdAt),
          topic1: item.sections[0]?.subtitle || '',
          content1: item.sections[0]?.text || '',
          topic2: item.sections[1]?.subtitle || '',
          content2: item.sections[1]?.text || '',
          topic3: item.sections[2]?.subtitle || '',
          content3: item.sections[2]?.text || '',
          topic4: item.sections[3]?.subtitle || '',
          content4: item.sections[3]?.text || '',
          topic5: item.sections[4]?.subtitle || '',
          content5: item.sections[4]?.text || '',
          challengeItems: item.challenge || [],
          solutionItems: item.solution || [],
        }));
        setrecords(formattedData);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  // NEW: Check scheduled studies every minute
  useEffect(() => {
    checkAndUpdateScheduledStudies();
    const interval = setInterval(checkAndUpdateScheduledStudies, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [records]);

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

  // MOVED BEFORE useMemo - Helper function to get status color class
  const getstatuscolorclass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500';
      case 'Completed': return 'bg-[#800000]';
      case 'Draft': return 'bg-rose-400';
      case 'Scheduled': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  const calendardata = useMemo(() => {
  const year = today.getFullYear();  // ← Instead of hardcoded 2026
    const firstdayofmonth = new Date(year, selectedmonthindex, 1).getDay();
    const startpadding = firstdayofmonth === 0 ? 6 : firstdayofmonth - 1;
    const daysinmonth = new Date(year, selectedmonthindex + 1, 0).getDate();
    const prevmonthdays = new Date(year, selectedmonthindex, 0).getDate();
    const days = [];
    
    // Add previous month days
    for (let i = startpadding - 1; i >= 0; i--) { 
      days.push({ day: prevmonthdays - i, currentmonth: false, markedDates: [], istoday: false, fullDate: '' }); 
    }
    
    // Add current month days
    for (let d = 1; d <= daysinmonth; d++) {
      const dateString = `${year}-${String(selectedmonthindex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const markedDates = records
        .filter(r => {
          const start = r.start;
          const end = r.isUnfinished ? todaystr : r.end;
          const scheduled = r.scheduleDate;
          return (dateString >= start && dateString <= end) || dateString === scheduled;
        })
        .map(r => {
          if (r.scheduleDate === dateString && r.status === 'Scheduled') {
            return { status: r.status, color: 'bg-orange-400' };
          }
          return { status: r.status, color: getstatuscolorclass(r.status) };
        });

      const istoday = dateString === todaystr;
      days.push({ day: d, currentmonth: true, markedDates, istoday, fullDate: dateString });
    }
    
    const totalcells = Math.ceil(days.length / 7) * 7;
    const nextmonthdays = totalcells - days.length;
    for (let i = 1; i <= nextmonthdays; i++) { 
      days.push({ day: i, currentmonth: false, markedDates: [], istoday: false, fullDate: '' }); 
    }
    return days;
}, [selectedmonthindex, records, todaystr]);

  // NEW: Handle date click to show case studies for that date
  const handleDateClick = (dateData: any) => {
    if (!dateData.currentmonth || !dateData.fullDate) return;

    const caseStudiesForDate = records.filter(r => {
      const start = r.start;
      const end = r.isUnfinished ? todaystr : r.end;
      const scheduled = r.scheduleDate;
      return (dateData.fullDate >= start && dateData.fullDate <= end) || dateData.fullDate === scheduled;
    });

    setselecteddatedata({
      date: dateData.fullDate,
      caseStudies: caseStudiesForDate
    });
    setshowdatemodal(true);
  };

  const resetform = () => {
    settitle('');
    setsubtitle('');
    setauthor('');
    setchallenge('');
    setsolution('');
    setresult('');
    setcategories(['Technology']);
    setstatus('Active');
    setstartdate(getCurrentDate()); // Defaults to Today
    setenddate(''); // Reset end date to empty (user must choose)
    setisunfinished(false);
    setscheduledate('2026-02-01');
    setscheduletime('09:00');
    setselectedimage(null);
    setselectedfile(null);
    settopic1('');
    setcontent1('');
    settopic2('');
    setcontent2('');
    settopic3('');
    setcontent3('');
    settopic4('');
    setcontent4('');
    settopic5('');
    setcontent5('');
    setIsEditMode(false);
    setEditingId(null);
    seterror(null);
    setsuccess(null);
    setTimeError(null);
  };

const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      seterror('Only JPEG, JPG, PNG, and WEBP images are allowed');
      setTimeout(() => seterror(null), 3000);
      return;
    }
    
    setselectedfile(file);
    const reader = new FileReader();
    reader.onloadend = () => setselectedimage(reader.result as string);
    reader.readAsDataURL(file);
  }
};

const handleCancelImage = () => {
  setselectedimage(null);
  setselectedfile(null);
  if (fileref.current) {
    fileref.current.value = '';
  }
};

  const handleImagePaste = (e: React.ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      if (blob) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(blob.type)) {
          seterror('Only JPEG, JPG, PNG, and WEBP images are allowed');
          setTimeout(() => seterror(null), 3000);
          return;
        }
        
        setselectedfile(blob);
        const reader = new FileReader();
        reader.onloadend = () => setselectedimage(reader.result as string);
        reader.readAsDataURL(blob);
      }
    }
  }
};

const validateAuthorName = (name: string): boolean => {
  const validNameRegex = /^[a-zA-Z\s\-'.]+$/;
  return validNameRegex.test(name) || name === '';
};

const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  if (validateAuthorName(newValue)) {
    setauthor(newValue);
  }
};

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  if (newValue.length <= 30) {
    settitle(newValue);
  }
};

const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newEndDate = e.target.value;
  
  // Validation: Must be strictly AFTER start date
  if (newEndDate <= startdate) {
    seterror('End date must be after start date');
    setTimeout(() => seterror(null), 3000);
    return; // Block the change
  }
  
  setenddate(newEndDate);
};

const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newStartDate = e.target.value;
  setstartdate(newStartDate);
if (enddate && startdate && enddate <= startdate) {
  seterror('End date must be after start date');
  setTimeout(() => seterror(null), 3000);
  return;
}
  setstartdate(newStartDate);
};

const handlesubmit = async () => {
  if (status === 'Draft') {
    // For Draft: Only Title, Author, Challenge, Solution, and Section 1 required
    if (!title.trim() || !author.trim() || !challenge.trim() || !solution.trim() || 
        !topic1.trim() || !content1.trim()) {
      seterror('For Draft status: Title, Author, Challenge, Solution, and Section 1 (Topic + Content) are required');
      setTimeout(() => seterror(null), 3000);
      return;
    }
  } else {
    if (!title.trim() || !author.trim() || !challenge.trim() || !solution.trim() ||
        !topic1.trim() || !content1.trim() || !topic2.trim() || !content2.trim() ||
        !topic3.trim() || !content3.trim() || !topic4.trim() || !content4.trim() ||
        !topic5.trim() || !content5.trim()) {
      seterror('Please fill in all required fields including all 5 content sections');
      setTimeout(() => seterror(null), 3000);
      return;
    }
  }

    if (!selectedfile && !isEditMode) {
      seterror('Please select a cover image');
      setTimeout(() => seterror(null), 3000);
      return;
    }

    // NEW: Validate schedule time if status is Scheduled
    if (status === 'Scheduled') {
      if (!validateScheduleTime(scheduledate, scheduletime)) {
        seterror(timeError || 'Invalid schedule time');
        setTimeout(() => seterror(null), 3000);
        return;
      }
    }

    setisloading(true);
    seterror(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('author', author);
      formData.append('status', status.toLowerCase());
      
      formData.append('tags', categories.map(c => c.toLowerCase()).join(','));
      
      formData.append('challenge', challenge);
      formData.append('solution', solution);
      formData.append('startDate', startdate);
      formData.append('endDate', enddate);
      formData.append('isUnfinished', isunfinished.toString());
      formData.append('scheduleDate', scheduledate);
      formData.append('scheduleTime', scheduletime);
      
      // Add 5 topic sections as subtitle0-text0 through subtitle4-text4
      formData.append('subtitle0', topic1);
      formData.append('text0', content1);
      formData.append('subtitle1', topic2);
      formData.append('text1', content2);
      formData.append('subtitle2', topic3);
      formData.append('text2', content3);
      formData.append('subtitle3', topic4);
      formData.append('text3', content4);
      formData.append('subtitle4', topic5);
      formData.append('text4', content5);

      if (selectedfile) {
        formData.append('cover', selectedfile);
      }

      const url = isEditMode 
        ? `http://localhost:3000/api/casestudies/${editingId}`
        : 'http://localhost:3000/api/casestudies';
      
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        credentials: 'include', 
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isEditMode) {
          setrecords(prev => prev.map(r => r.id === editingId ? {
            id: data._id,
            title: data.title,
            subtitle: data.subtitle || '',
            author: data.author,
            challenge: data.challenge[0]?.text || '',
            solution: data.solution[0]?.text || '',
            result: '',
            status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
            categories: data.tags.map((tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1)),
            start: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : todaystr,
            end: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : data.updatedAt ? new Date(data.updatedAt).toISOString().split('T')[0] : todaystr,
            isUnfinished: data.isUnfinished || false,
            scheduleDate: data.scheduleDate ? new Date(data.scheduleDate).toISOString().split('T')[0] : '',
            scheduleTime: data.scheduleTime || '09:00',
            image: data.cover,
            date: new Date(data.updatedAt || data.createdAt),
            topic1: data.sections[0]?.subtitle || '',
            content1: data.sections[0]?.text || '',
            topic2: data.sections[1]?.subtitle || '',
            content2: data.sections[1]?.text || '',
            topic3: data.sections[2]?.subtitle || '',
            content3: data.sections[2]?.text || '',
            topic4: data.sections[3]?.subtitle || '',
            content4: data.sections[3]?.text || '',
            topic5: data.sections[4]?.subtitle || '',
            content5: data.sections[4]?.text || '',
            challengeItems: data.challenge || [],
            solutionItems: data.solution || [],
          } : r));
          setsuccess('Case study updated successfully!');
        } else {
          const newRecord = {
            id: data._id,
            title: data.title,
            subtitle: data.subtitle || '',
            author: data.author,
            challenge: data.challenge[0]?.text || '',
            solution: data.solution[0]?.text || '',
            result: '',
            status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
            categories: data.tags.map((tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1)),
            start: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : new Date(data.createdAt).toISOString().split('T')[0],
            end: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : new Date(data.createdAt).toISOString().split('T')[0],
            isUnfinished: data.isUnfinished || false,
            scheduleDate: data.scheduleDate ? new Date(data.scheduleDate).toISOString().split('T')[0] : '',
            scheduleTime: data.scheduleTime || '09:00',
            image: data.cover,
            date: new Date(data.createdAt),
            topic1: data.sections[0]?.subtitle || '',
            content1: data.sections[0]?.text || '',
            topic2: data.sections[1]?.subtitle || '',
            content2: data.sections[1]?.text || '',
            topic3: data.sections[2]?.subtitle || '',
            content3: data.sections[2]?.text || '',
            topic4: data.sections[3]?.subtitle || '',
            content4: data.sections[3]?.text || '',
            topic5: data.sections[4]?.subtitle || '',
            content5: data.sections[4]?.text || '',
            challengeItems: data.challenge || [],
            solutionItems: data.solution || [],
          };
          setrecords(prev => [newRecord, ...prev]);
          setsuccess('Case study created successfully!');
        }

        resetform();
        setshowconfirmmodal(false);
        setTimeout(() => setsuccess(null), 3000);
      } else {
        const errorData = await response.json();
        seterror(errorData.error || 'Failed to save case study');
        setTimeout(() => seterror(null), 3000);
      }
    } catch (error) {
      console.error('Error saving case study:', error);
      seterror('An error occurred while saving the case study');
      setTimeout(() => seterror(null), 3000);
    } finally {
      setisloading(false);
    }
  };

  const handleedit = (rec: any) => {
    if (isEditMode && editingId === rec.id) {
      resetform();
      return;
    }

    setIsEditMode(true);
    setEditingId(rec.id);
    settitle(rec.title);
    setsubtitle(rec.subtitle || '');
    setauthor(rec.author);
    setchallenge(rec.challenge);
    setsolution(rec.solution);
    setresult(rec.result || '');
    setcategories(rec.categories || ['Technology']);
    setstatus(rec.status);
    setstartdate(rec.start);
    setenddate(rec.end);
    setisunfinished(rec.isUnfinished || false);
    setscheduledate(rec.scheduleDate || '2026-02-01');
    setscheduletime(rec.scheduleTime || '09:00');
    setselectedimage(rec.image);
    settopic1(rec.topic1 || '');
    setcontent1(rec.content1 || '');
    settopic2(rec.topic2 || '');
    setcontent2(rec.content2 || '');
    settopic3(rec.topic3 || '');
    setcontent3(rec.content3 || '');
    settopic4(rec.topic4 || '');
    setcontent4(rec.content4 || '');
    settopic5(rec.topic5 || '');
    setcontent5(rec.content5 || '');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handledeleteclick = (rec: any) => {
    setdeletetarget(rec);
    setshowdeletemodal(true);
  };

  const handleconfirmdelete = async () => {
    if (!deletetarget) return;
  setisdeleting(true);
  try {
    const response = await fetch(`http://localhost:3000/api/casestudies/${deletetarget.id}`, {
      method: 'DELETE',
      credentials: 'include',  // ← DAGDAG ITO
    });

      if (response.ok) {
        setrecords(prev => prev.filter(r => r.id !== deletetarget.id));
        setsuccess('Case study deleted successfully!');
        setTimeout(() => setsuccess(null), 3000);
        
        if (isEditMode && editingId === deletetarget.id) {
          resetform();
        }
      } else {
        seterror('Failed to delete case study');
        setTimeout(() => seterror(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
      seterror('An error occurred while deleting');
      setTimeout(() => seterror(null), 3000);
    } finally {
      setisdeleting(false);
      setshowdeletemodal(false);
      setdeletetarget(null);
    }
  };

  const handlepreview = (rec: any) => {
    setpreviewdata(rec);
    setshowpreviewmodal(true);
  };

  const handleCategoryToggle = (category: string) => {
    setcategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredrecords = useMemo(() => {
    let result = records;
    if (activetab !== 'All') {
      result = result.filter(r => r.status === activetab);
    }
    if (filteredcategories.length > 0) {
      result = result.filter(r => 
        r.categories && r.categories.some((cat: string) => filteredcategories.includes(cat))
      );
    }
    if (searchquery.trim()) {
      const q = searchquery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.challenge.toLowerCase().includes(q) ||
        r.solution.toLowerCase().includes(q)
      );
    }
    if (sortby === 'Newest') {
      result = [...result].sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sortby === 'Oldest') {
      result = [...result].sort((a, b) => a.date.getTime() - b.date.getTime());
    } else if (sortby === 'Title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [records, activetab, searchquery, sortby, filteredcategories]);

  const getstatuscolor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500';
      case 'Completed': return 'bg-[#800000]';
      case 'Draft': return 'bg-rose-400';
      case 'Scheduled': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  // NEW: Get status color for filter badges
  const getstatusbadgecolor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'Completed': return 'bg-[#800000] hover:bg-[#600000]';
      case 'Draft': return 'bg-rose-400 hover:bg-rose-500';
      case 'Scheduled': return 'bg-orange-400 hover:bg-orange-500';
      default: return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  // NEW: Get category color for filter badges
  const getcategorybadgecolor = (category: string) => {
    switch (category) {
      case 'Technology': return 'bg-blue-500 hover:bg-blue-600';
      case 'Logistics': return 'bg-purple-500 hover:bg-purple-600';
      case 'Analytics': return 'bg-teal-500 hover:bg-teal-600';
      case 'Infrastructure': return 'bg-indigo-500 hover:bg-indigo-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // NEW: Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setfilteredcategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const tabs = [
    { name: 'All', count: records.length },
    { name: 'Active', count: records.filter(r => r.status === 'Active').length },
    { name: 'Completed', count: records.filter(r => r.status === 'Completed').length },
    { name: 'Draft', count: records.filter(r => r.status === 'Draft').length },
    { name: 'Scheduled', count: records.filter(r => r.status === 'Scheduled').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171717]">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 text-sm font-bold">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 text-sm font-bold">
          {success}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showdeletemodal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[3rem] p-12 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Are you sure you want to delete "{deletetarget?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setshowdeletemodal(false)}
                disabled={isdeleting}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleconfirmdelete}
                disabled={isdeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isdeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Date Selection Modal - Shows case studies for selected date */}
      {showdatemodal && selecteddatedata && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[2rem] p-8 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {new Date(selecteddatedata.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setshowdatemodal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {selecteddatedata.caseStudies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No case study available for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selecteddatedata.caseStudies.map((cs: any) => (
                  <div 
                    key={cs.id}
                    onClick={() => {
                      setshowdatemodal(false);
                      handlepreview(cs);
                    }}
                    className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                          {cs.title}
                        </h4>
                        {cs.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                            {cs.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-3 py-1 rounded-full font-bold text-white ${getstatuscolor(cs.status)}`}>
                            {cs.status}
                          </span>
                          {cs.categories && cs.categories.slice(0, 2).map((cat: string) => (
                            <span key={cat} className="text-[9px] px-3 py-1 rounded-full font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => setshowdatemodal(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showpreviewmodal && previewdata && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[3rem] p-12 max-w-4xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Preview: {previewdata.title}</h3>
              <button
                onClick={() => setshowpreviewmodal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {previewdata.image && (
              <div className="w-full h-64 rounded-[2rem] overflow-hidden mb-8">
                <img src={previewdata.image} className="w-full h-full object-cover" alt={previewdata.title} />
              </div>
            )}

            <div className="mb-8">
              {previewdata.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{previewdata.subtitle}</p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-xs px-4 py-2 rounded-2xl font-bold text-white ${getstatuscolor(previewdata.status)}`}>
                  {previewdata.status}
                </span>
                {previewdata.categories && previewdata.categories.map((cat: string) => (
                  <span key={cat} className="text-xs px-4 py-2 rounded-2xl font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                    {cat}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">By {previewdata.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {previewdata.start} — {previewdata.isUnfinished ? 'Unfinished' : previewdata.end}
              </p>
              {previewdata.status === 'Scheduled' && previewdata.scheduleDate && (
                <p className="text-sm text-orange-600 dark:text-orange-400 font-bold mt-2">
                  Scheduled for: {previewdata.scheduleDate} at {previewdata.scheduleTime}
                </p>
              )}
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Sections</h4>
              {[1, 2, 3, 4, 5].map(num => {
                const topic = previewdata[`topic${num}`];
                const content = previewdata[`content${num}`];
                if (!topic && !content) return null;
                return (
                  <div key={num} className="mb-6 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <h5 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{topic}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{content}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Challenge</h4>
              {previewdata.challengeItems && previewdata.challengeItems.length > 0 ? (
                previewdata.challengeItems.map((item: any, idx: number) => (
                  <div key={idx} className="mb-4 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl">
                    <h5 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">{item.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{item.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl">
                  {previewdata.challenge}
                </p>
              )}
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Solution</h4>
              {previewdata.solutionItems && previewdata.solutionItems.length > 0 ? (
                previewdata.solutionItems.map((item: any, idx: number) => (
                  <div key={idx} className="mb-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                    <h5 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">{item.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{item.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                  {previewdata.solution}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setshowpreviewmodal(false)}
                className="px-8 py-3 bg-[#800000] text-white rounded-2xl font-bold hover:bg-[#600000] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal (Fullscreen) */}
      {showcalendarmodal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[3rem] p-12 max-w-6xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar View</h3>
              <button
                onClick={() => setshowcalendarmodal(false)}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
              {months.map((m, idx) => (
                <span
                  key={m}
                  onClick={() => setselectedmonthindex(idx)}
                  className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer whitespace-nowrap ${
                    idx === selectedmonthindex ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4 text-center mb-8">
              {daysshort.map(day => (
                <span key={day} className="text-gray-400 text-sm font-bold uppercase">{day}</span>
              ))}
              {calendardata.map((d, i) => (
                <div 
                  key={i} 
                  className="relative py-3 flex items-center justify-center h-16"
                  onClick={() => handleDateClick(d)}
                >
                  {d.markedDates && d.markedDates.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {d.markedDates.map((mark, idx) => (
                        <div
                          key={idx}
                          className={`absolute w-12 h-12 rounded-full ${mark.color} opacity-30`}
                          style={{
                            transform: d.markedDates.length > 1
                              ? `translateX(${(idx - (d.markedDates.length - 1) / 2) * 8}px)`
                              : 'none'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <span
                    className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg ${
                      d.istoday
                        ? 'border-2 border-[#800000] font-bold'
                        : d.currentmonth
                        ? 'text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10'
                        : 'text-gray-400'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 border-t pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#800000]"></div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">COMPLETED</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">DRAFT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">SCHEDULED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Case Studies</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and analyze your research records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <div className="lg:col-span-2 bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5">
            <h4 className="text-sm font-bold tracking-tight mb-6" style={{ color: '#4a5565' }}>
              {isEditMode ? 'Edit Case Study' : 'New Case Study'}
            </h4>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
<label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Title * <span className="text-gray-400">({title.length}/30)</span>
</label>
<input
  type="text"
  value={title}
  onChange={handleTitleChange}
  maxLength={30}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                  placeholder="Enter case study title"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setsubtitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                  placeholder="Enter subtitle (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
<label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Author * <span className="text-[9px] text-gray-400">(letters, spaces, -, ', . only)</span>
</label>
<input
  type="text"
  value={author}
  onChange={handleAuthorChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                  placeholder="Enter author name"
                />
              </div>
              
              <div className="relative">
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Category *</label>
                <div
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-wrap gap-1">
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-[#800000] text-white rounded-lg text-xs font-bold">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Select categories</span>
                    )}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-2">
                    {availableCategories.map(cat => (
                      <div
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          categories.includes(cat) 
                            ? 'bg-[#800000] border-[#800000]' 
                            : 'border-gray-300 dark:border-white/20'
                        }`}>
                          {categories.includes(cat) && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{cat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
              <div>
<label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Cover Image * <span className="text-[9px] text-gray-400">(JPEG, JPG, PNG, WEBP)</span>
</label>
<input
  ref={fileref}
  type="file"
  accept=".jpg,.jpeg,.png,.webp"
  onChange={handleimagechange}
  className="hidden"
/>
<div className="flex gap-2">
  <button
    onClick={() => fileref.current?.click()}
    className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm hover:border-[#800000] transition-colors bg-white dark:bg-white/5 text-left"
  >
    {selectedimage ? '✓ Image selected' : 'Choose image'}
  </button>
  {selectedimage && (
    <button
      onClick={handleCancelImage}
      className="px-4 py-3 border border-red-200 dark:border-red-900/20 rounded-2xl text-sm hover:border-red-500 transition-colors bg-white dark:bg-white/5 text-red-600"
      title="Cancel image"
    >
      ✕
    </button>
  )}
</div>
              </div>
            </div>

            {selectedimage && (
  <div 
    className="mb-6 relative group"
    onPaste={handleImagePaste}
  >
    <img src={selectedimage} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
      <p className="text-white text-sm font-bold">Click "Choose image" to change or paste a new image</p>
    </div>
  </div>
)}

{!selectedimage && (
  <div 
    className="mb-6 p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl text-center cursor-pointer hover:border-[#800000] transition-colors"
    onClick={() => fileref.current?.click()}
    onPaste={handleImagePaste}
  >
    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
      Click to choose or paste an image (Ctrl/Cmd+V)
    </p>
    <p className="text-xs text-gray-400 mt-2">JPEG, JPG, PNG, WEBP only</p>
  </div>
)}

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Start Date <span className="text-[9px] text-gray-400">(defaults to today)</span>
</label>
<input
  type="date"
  value={startdate}
  onChange={handleStartDateChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                />
              </div>
              <div>
  <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
    End Date <span className="text-[9px] text-gray-400">(must be after start date)</span>
  </label>
  <input
    type="date"
    value={enddate}
    min={startdate} // ADD THIS: Disables dates before start date in the calendar
    onChange={handleEndDateChange}
    disabled={isunfinished}
    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5 disabled:opacity-50"
  />
</div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isunfinished}
                  onChange={(e) => setisunfinished(e.target.checked)}
                  className="w-4 h-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Mark as Unfinished</span>
              </label>
            </div>

            {status === 'Scheduled' && (
              <div className="grid grid-cols-2 gap-6 mb-6 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-900/20">
                <div>
                  <label className="block text-[10px] text-orange-700 dark:text-orange-400 font-bold mb-2 uppercase tracking-wide">Schedule Date *</label>
                  <input
                    type="date"
                    value={scheduledate}
                    onChange={(e) => handleScheduleDateChange(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 dark:border-orange-900/20 rounded-2xl text-sm focus:outline-none focus:border-orange-500 bg-white dark:bg-white/5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-orange-700 dark:text-orange-400 font-bold mb-2 uppercase tracking-wide">Schedule Time *</label>
                  <input
                    type="time"
                    value={scheduletime}
                    onChange={(e) => handleScheduleTimeChange(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 dark:border-orange-900/20 rounded-2xl text-sm focus:outline-none focus:border-orange-500 bg-white dark:bg-white/5"
                  />
                </div>
                {timeError && (
                  <div className="col-span-2 text-xs text-red-600 dark:text-red-400 font-bold">
                    {timeError}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6 mb-6">
<h5 className="text-sm font-bold text-gray-700 dark:text-gray-300">
  Content Sections {status === 'Draft' ? '(Minimum 1 Required) *' : '(5 Required) *'}
</h5>              {[1, 2, 3, 4, 5].map((num) => {
                const topicValue = eval(`topic${num}`);
                const contentValue = eval(`content${num}`);
                const setTopicFunc = eval(`settopic${num}`);
                const setContentFunc = eval(`setcontent${num}`);
                
                return (
                  <div key={num} className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">

<h6 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
  Section {num} {status !== 'Draft' || num === 1 ? '*' : <span className="text-gray-400 font-normal lowercase">(optional)</span>}
</h6>

               <div className="space-y-4">
                      <div>
<label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Topic/Subtitle {status !== 'Draft' && '*'}
</label>                        <input
                          type="text"
                          value={topicValue}
                          onChange={(e) => setTopicFunc(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5"
                          placeholder={`Enter topic for section ${num}`}
                        />
                      </div>
                      <div>
<label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
  Content {status !== 'Draft' && '*'}
</label>                        <textarea
                          value={contentValue}
                          onChange={(e) => setContentFunc(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5 resize-none"
                          placeholder={`Enter content for section ${num}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Challenge *</label>
                <textarea
                  value={challenge}
                  onChange={(e) => setchallenge(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5 resize-none"
                  placeholder="Describe the challenge..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">Solution *</label>
                <textarea
                  value={solution}
                  onChange={(e) => setsolution(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#800000] bg-white dark:bg-white/5 resize-none"
                  placeholder="Describe the solution..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              {isEditMode && (
                <button
                  onClick={resetform}
                  className="flex-1 px-6 py-4 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={() => setshowconfirmmodal(true)}
                disabled={isloading}
                className="flex-1 px-6 py-4 bg-[#800000] text-white rounded-2xl font-bold hover:bg-[#600000] transition-colors disabled:opacity-50"
              >
                {isloading ? 'Saving...' : (isEditMode ? 'Update Case Study' : 'Create Case Study')}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5">
              <h4 className="text-gray-800 dark:text-white text-sm font-bold mb-6">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Active', val: records.filter(r => r.status === 'Active').length, sub: 'Ongoing' },
                  { label: 'Done', val: records.filter(r => r.status === 'Completed').length, sub: 'Complete' },
                  { label: 'Draft', val: records.filter(r => r.status === 'Draft').length, sub: 'Drafts' },
                  { label: 'Schedule', val: records.filter(r => r.status === 'Scheduled').length, sub: 'Scheduled' }
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl flex flex-col items-center border border-gray-100 dark:border-white/10">
                    <span className="text-2xl font-bold text-[#800000]">{s.val}</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl flex flex-col items-center border border-gray-100 dark:border-white/10">
                  <span className="text-3xl font-bold text-[#800000]">{records.length}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Total</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-gray-800 dark:text-white text-sm font-bold">Timeline & Events</h4>
                <button 
                  onClick={() => setshowcalendarmodal(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  title="View Fullscreen Calendar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600 dark:text-gray-400" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
                {months.map((m, idx) => (
                  <span key={m} onClick={() => setselectedmonthindex(idx)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold cursor-pointer whitespace-nowrap ${idx === selectedmonthindex ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-gray-600'}`}>{m}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 text-center">
                {daysshort.map(day => <span key={day} className="text-gray-400 text-[9px] font-bold uppercase">{day}</span>)}
                {calendardata.map((d, i) => (
                  <div 
                    key={i} 
                    className="relative py-1 flex items-center justify-center h-9"
                    onClick={() => handleDateClick(d)}
                  >
                    {d.markedDates && d.markedDates.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {d.markedDates.map((mark, idx) => (
                          <div 
                            key={idx} 
                            className={`absolute w-7 h-7 rounded-full ${mark.color} opacity-30`}
                            style={{ 
                              transform: d.markedDates.length > 1 
                                ? `translateX(${(idx - (d.markedDates.length - 1) / 2) * 4}px)` 
                                : 'none' 
                            }}
                          />
                        ))}
                      </div>
                    )}
<span className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-[12px] ${
  d.istoday 
    ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50 dark:bg-blue-900/20 font-bold text-blue-600 dark:text-blue-400' 
    : d.currentmonth 
    ? 'text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' 
    : 'text-gray-400'
}`}>                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-4 border-t pt-4">
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[8px] font-bold text-gray-400">ACTIVE</span></div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#800000]"></div><span className="text-[8px] font-bold text-gray-400">COMPLETED</span></div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div><span className="text-[8px] font-bold text-gray-400">DRAFT</span></div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div><span className="text-[8px] font-bold text-gray-400">SCHED</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-16 pb-20">
          <div className="px-2 mb-6">
            <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Case Study Library</h4>
            <p className="text-[10px] text-gray-400">All registered analysis and records</p>
          </div>

          {/* NEW: Status Filter - Tag Style */}
          <div className="px-2 mb-6">
            <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3">Status</h5>
            <div className="flex flex-wrap gap-2">
              {['All', 'Active', 'Completed', 'Draft', 'Scheduled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setactivetab(status)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activetab === status
                      ? `${status === 'All' ? 'bg-gray-700' : getstatusbadgecolor(status)} text-white shadow-md`
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  {status} ({status === 'All' ? records.length : records.filter(r => r.status === status).length})
                </button>
              ))}
            </div>
          </div>

          {/* NEW: Category Filter - Tag Style */}
          <div className="px-2 mb-6">
            <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3">Category</h5>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = filteredcategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? `${getcategorybadgecolor(category)} text-white shadow-md`
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {category}
                    {isSelected && (
                      <span className="ml-1">×</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-transparent p-12 rounded-[4rem] shadow-sm border border-gray-100 dark:border-white/5 min-h-[400px]">
            {filteredrecords.length === 0 ? <p className="text-center text-[11px] text-gray-300 mt-20 tracking-widest uppercase font-bold">No records found</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredrecords.map((rec) => (
                  <div key={rec.id} className={`group border ${isEditMode && editingId === rec.id ? 'border-[#800000] shadow-lg' : 'border-gray-100'} rounded-[3rem] p-10 hover:shadow-xl transition-all flex flex-col relative bg-white`}>
                    {rec.image && <div className="w-full h-32 rounded-[2rem] overflow-hidden mb-6"><img src={rec.image} className="w-full h-full object-cover" alt="Study" /></div>}
                    {isEditMode && editingId === rec.id && (
                      <div className="absolute top-6 right-6 bg-[#800000] text-white px-3 py-1 rounded-full text-[9px] font-bold">
                        EDITING
                      </div>
                    )}
                    <h4 className="text-[20px] text-gray-900 font-bold mb-2">{rec.title}</h4>
                    {rec.subtitle && <p className="text-[13px] text-gray-500 mb-2">{rec.subtitle}</p>}
                    <p className="text-[11px] text-gray-400 mb-1">By {rec.author}</p>
                    <p className="text-[11px] text-gray-400 mb-4">{rec.start} — {rec.isUnfinished ? 'Unfinished' : rec.end}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className={`text-[9px] px-5 py-2 rounded-2xl font-bold text-white ${getstatuscolor(rec.status)}`}>{rec.status}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handlepreview(rec)} 
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleedit(rec)} 
                          className={`p-2 transition-colors ${isEditMode && editingId === rec.id ? 'text-[#800000]' : 'text-gray-400 hover:text-[#800000]'}`}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handledeleteclick(rec)} 
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showconfirmmodal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[3rem] p-12 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditMode ? 'Confirm Update' : 'Confirm Creation'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isEditMode 
                ? 'Are you sure you want to update this case study?' 
                : 'Are you sure you want to create this case study?'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setshowconfirmmodal(false)}
                disabled={isloading}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlesubmit}
                disabled={isloading}
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-2xl font-bold hover:bg-[#600000] transition-colors disabled:opacity-50"
              >
                {isloading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
