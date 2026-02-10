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
  if (newValue.length <= 50) {
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
    <div className="flex flex-col items-start justify-start p-4 space-y-4 min-h-screen bg-[#f8f9fa] dark:bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
          <div className="bg-white dark:bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
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
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors text-sm"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8 font-['Poppins']">
          <div className="bg-white rounded-[3rem] overflow-hidden max-w-7xl w-full shadow-2xl flex h-[85vh]">
            
            {/* Left Side: Calendar Grid */}
            <div className="flex-[2] p-10 flex flex-col border-r border-gray-50">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">Calendar</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-1">Select a date to view details</p>
              </div>

              {/* Month Selector */}
              <div className="flex gap-1 mb-8 p-1 bg-gray-50/50 rounded-2xl border border-gray-100">
                {months.map((m, idx) => (
                  <span
                    key={m}
                    onClick={() => setselectedmonthindex(idx)}
                    className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all duration-200 whitespace-nowrap ${
                      idx === selectedmonthindex 
                        ? 'bg-[#800000] text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.substring(1, 3).toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-4 text-center mb-4">
                {daysshort.map(day => (
                  <span key={day} className="text-[#800000] text-[10px] font-black uppercase opacity-40">
                    {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-3 flex-1">
                {calendardata.map((d, i) => (
                  <div 
                    key={i} 
                    className={`group relative rounded-[1.5rem] transition-all duration-200 border flex items-center justify-center ${
                      d.currentmonth ? 'bg-white border-gray-100 hover:border-[#800000]/10 hover:shadow-md cursor-pointer' : 'bg-transparent border-transparent opacity-20'
                    }`}
                    onClick={() => handleDateClick(d)}
                  >
                    <div className="absolute top-2 right-2 flex -space-x-1">
                      {d.markedDates && d.markedDates.length > 0 && d.markedDates.map((mark, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full border border-white ${mark.color}`}
                        />
                      ))}
                    </div>
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all ${
                        d.istoday
                          ? 'bg-[#800000] text-white font-bold shadow-lg'
                          : d.currentmonth
                          ? 'text-gray-500 font-semibold'
                          : 'text-gray-300'
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Details Panel */}
            <div className="flex-1 bg-gray-50/50 p-12 flex flex-col relative overflow-hidden">
              <button
                onClick={() => setshowcalendarmodal(false)}
                className="absolute top-10 right-10 p-2 rounded-full bg-white text-gray-400 hover:text-red-600 shadow-sm transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Top Title and Subtext */}
              <div className="mt-12 mb-8">
                <h3 className="text-[18px] font-bold text-gray-800">Event Details</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">
                  Stay updated with our project timeline and milestone completions.
                </p>
              </div>

              {/* Main Info Section */}
              <div className="space-y-8">
                {/* Tip Box */}
                <div className="p-6 bg-[#800000]/5 rounded-[2rem] border border-[#800000]/10">
                  <p className="text-[10px] text-[#800000] font-bold uppercase mb-1">Tip</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">Click on any highlighted date to view associated case studies or project updates.</p>
                </div>

                {/* Legend Section */}
                <div className="grid grid-cols-2 gap-y-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#800000]"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Draft</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Scheduled</span>
                  </div>
                </div>
              </div>

              {/* Flexible spacer */}
              <div className="flex-1"></div>
            </div>

          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto space-y-6 overflow-y-auto">

      <div className="space-y-2 px-2">
        <h2 className="text-xl leading-none tracking-tight font-bold" style={{ color: '#4a5565' }}>
            Admin Control Center
        </h2>
        <p className="text-[11px] tracking-wide italic text-gray-400 dark:text-gray-500">
            Manage Your Administrative Profile And System Security Credentials.
        </p>
      </div>

{/* section: case study entry form - container perfectly matched with quick stats border and padding */}
<div className="flex flex-col gap-6 font-['Poppins',_sans-serif]">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* quick stats card */}
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#4a5565] uppercase tracking-wider">
              Quick Stats
            </h4>
            <p className="text-[10px] text-gray-400">
              current system overview and counts
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">Total</span>
            <span className="text-2xl font-black text-[#800000] leading-none">{records.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Active', val: records.filter(r => r.status === 'Active').length, icon: '⚡' },
          { label: 'Done', val: records.filter(r => r.status === 'Completed').length, icon: 'Check' },
          { label: 'Draft', val: records.filter(r => r.status === 'Draft').length, icon: '📝' },
          { label: 'Schedule', val: records.filter(r => r.status === 'Scheduled').length, icon: '📅' }
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-[1.75rem] border border-gray-100 shadow-sm flex items-center justify-between group">
            <div>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter block mb-1">{s.label}</span>
              <div className="text-3xl font-black text-[#1e293b]">{s.val}</div>
            </div>
            <div className="w-10 h-10 bg-[#800000] rounded-2xl flex items-center justify-center shadow-lg shadow-[#800000]/20">
              {s.icon === 'Check' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : <span className="text-white text-xl">{s.icon}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* timeline section */}
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#4a5565] uppercase tracking-wider">
              Timeline & Events
            </h4>
            <p className="text-[10px] text-gray-400">
              Scheduled activities and research milestones
            </p>
          </div>
          <button 
            onClick={() => setshowcalendarmodal(true)}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {months.map((m, idx) => (
          <span 
            key={m} 
            onClick={() => setselectedmonthindex(idx)} 
            className={`px-4 py-2 rounded-2xl text-[10px] font-bold cursor-pointer whitespace-nowrap transition-all ${idx === selectedmonthindex ? 'bg-[#800000] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            {m}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-3 text-center">
        {daysshort.map(day => (
          <span key={day} className="text-gray-400 text-[9px] font-black uppercase">{day.substring(0, 1)}</span>
        ))}
        {calendardata.map((d, i) => (
          <div key={i} className="relative py-1 flex items-center justify-center h-9 cursor-pointer" onClick={() => handleDateClick(d)}>
            {d.markedDates && d.markedDates.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                {d.markedDates.map((mark, idx) => (
                  <div key={idx} className={`absolute w-7 h-7 rounded-full ${mark.color} opacity-20`} style={{ transform: d.markedDates.length > 1 ? `translateX(${(idx - (d.markedDates.length - 1) / 2) * 4}px)` : 'none' }} />
                ))}
              </div>
            )}
            <span className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-xl text-[12px] transition-all ${d.istoday ? 'bg-[#800000] font-bold text-white shadow-lg shadow-[#800000]/20' : d.currentmonth ? 'text-gray-700 cursor-pointer hover:bg-gray-100 font-bold' : 'text-gray-200'}`}>
              {d.day}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[8px] font-bold text-gray-400 uppercase">ACTIVE</span></div>
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#800000]"></div><span className="text-[8px] font-bold text-gray-400 uppercase">COMPLETED</span></div>
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div><span className="text-[8px] font-bold text-gray-400 uppercase">DRAFT</span></div>
        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div><span className="text-[8px] font-bold text-gray-400 uppercase">SCHED</span></div>
      </div>
    </div>
  </div>

<div className="space-y-6 font-['Poppins',_sans-serif]">
  <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100">
    {/* Header */}
    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-5">
      <div>
        <h4 className="text-lg font-bold text-gray-800">
          {isEditMode ? 'Edit Case Study' : 'New Case Study'}
        </h4>
        <p className="text-[11px] text-gray-400">Manage research database details</p>
      </div>
      <div className="px-4 py-1.5 bg-maroon-50 border border-maroon-100 rounded-full">
        <span className="text-[10px] font-black text-[#800000] uppercase tracking-wider">
          {status}
        </span>
      </div>
    </div>

    {/* Section 1: Basic Info */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
      <div className="md:col-span-2">
        <label className="block text-[11px] text-gray-500 font-bold mb-2 uppercase">Title * ({title.length}/30)</label>
        <input type="text" value={title} onChange={handleTitleChange} maxLength={30} className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-[#800000] focus:bg-white transition-all shadow-sm" placeholder="Analysis Title" />
      </div>
      <div>
        <label className="block text-[11px] text-gray-500 font-bold mb-2 uppercase">Subtitle</label>
        <input type="text" value={subtitle} onChange={(e) => setsubtitle(e.target.value)} className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-[#800000] focus:bg-white transition-all shadow-sm" placeholder="Subtitle" />
      </div>
    </div>

    {/* Section 2: Details Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
      <div>
        <label className="block text-[11px] text-gray-500 font-bold mb-2 uppercase">Author *</label>
        <input type="text" value={author} onChange={handleAuthorChange} className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-[#800000] focus:bg-white transition-all shadow-sm" placeholder="Full Name" />
      </div>
      <div className="relative">
        <label className="block text-[11px] text-gray-500 font-bold mb-2 uppercase">Category *</label>
        <div onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-[13px] cursor-pointer flex items-center justify-between min-h-[46px] shadow-sm">
          <div className="flex flex-wrap gap-1.5">
            {categories.length > 0 ? categories.map(cat => (
              <span key={cat} className="px-2.5 py-0.5 bg-[#800000] text-white rounded-lg text-[9px] font-bold uppercase">{cat}</span>
            )) : <span className="text-gray-400 italic">Select...</span>}
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {showCategoryDropdown && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-2">
            {availableCategories.map(cat => (
              <div key={cat} onClick={() => handleCategoryToggle(cat)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <div className={`w-3.5 h-3.5 rounded border-2 ${categories.includes(cat) ? 'bg-[#800000] border-[#800000]' : 'border-gray-200'}`} />
                <span className="text-xs text-gray-600 font-medium">{cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-[11px] text-gray-500 font-bold mb-2 uppercase">Status *</label>
        <select value={status} onChange={(e) => setstatus(e.target.value)} className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-[#800000] font-bold text-gray-700 shadow-sm appearance-none cursor-pointer">
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>
    </div>

    {/* Section 3: Image & Dates Dashboard */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-100 shadow-inner">
      <div className="space-y-4">
        <label className="block text-[11px] text-gray-400 font-bold uppercase tracking-widest">Case Study Thumbnail</label>
        <div 
          className="relative h-32 w-full border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center bg-white hover:border-[#800000] transition-all cursor-pointer group overflow-hidden shadow-sm"
          onClick={() => fileref.current?.click()}
        >
          {selectedimage ? (
            <img src={selectedimage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="text-center">
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#800000]">CHOOSE IMAGE FILE</span>
              <p className="text-[8px] text-gray-300 mt-1">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
        <input ref={fileref} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleimagechange} className="hidden" />
      </div>

      <div className="flex flex-col justify-center space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold mb-2 uppercase">Timeline Start</label>
            <input type="date" value={startdate} onChange={handleStartDateChange} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#800000] shadow-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 font-bold mb-2 uppercase">Timeline End</label>
            <input type="date" value={enddate} min={startdate} onChange={handleEndDateChange} disabled={isunfinished} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#800000] disabled:opacity-30 shadow-sm" />
          </div>
        </div>
        <label className="flex items-center gap-3 self-end cursor-pointer group">
          <input type="checkbox" checked={isunfinished} onChange={(e) => setisunfinished(e.target.checked)} className="peer hidden" />
          <div className="w-5 h-5 rounded-lg border-2 border-gray-200 peer-checked:bg-[#800000] peer-checked:border-[#800000] transition-all" />
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">Project Unfinished</span>
        </label>
      </div>
    </div>

    {/* Section 4: Content blocks - Redesigned to be more systematic */}
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
        <h5 className="text-[12px] font-black text-gray-700 uppercase tracking-widest">
          Content Framework
        </h5>
        <span className="text-[10px] text-gray-400 font-bold">
          {status === 'Draft' ? 'Minimum 1 Entry Required' : 'All 5 Sections Required'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map((num) => {
          const topicValue = eval(`topic${num}`);
          const contentValue = eval(`content${num}`);
          const setTopicFunc = eval(`settopic${num}`);
          const setContentFunc = eval(`setcontent${num}`);
          const isRequired = status !== 'Draft' || num === 1;
          
          return (
            <div key={num} className={`group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-3xl border transition-all duration-300 ${isRequired ? 'bg-white border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]' : 'bg-gray-50/40 border-transparent opacity-60'}`}>
              <div className="md:col-span-1 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${isRequired ? 'bg-[#800000] text-white shadow-lg shadow-maroon-100' : 'bg-gray-200 text-gray-400'}`}>
                  0{num}
                </div>
              </div>
              <div className="md:col-span-4">
                <input type="text" value={topicValue} onChange={(e) => setTopicFunc(e.target.value)} className="w-full px-0 py-2 text-[13px] font-bold text-gray-800 focus:outline-none border-b border-transparent focus:border-[#800000] bg-transparent transition-colors" placeholder={`Subtitle for Section ${num}`} />
                <label className="text-[8px] text-gray-300 uppercase font-black tracking-widest mt-1 block">Topic Header</label>
              </div>
              <div className="md:col-span-7">
                <textarea value={contentValue} onChange={(e) => setContentFunc(e.target.value)} rows={2} className="w-full px-5 py-3 bg-gray-50/50 rounded-2xl text-[12px] text-gray-600 focus:outline-none focus:bg-white focus:shadow-inner transition-all resize-none" placeholder="Provide detailed analytical content here..." />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Section 5: Challenge & Solution Summary */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 pt-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-red-400 rounded-full" />
          <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Key Challenge</label>
        </div>
        <textarea value={challenge} onChange={(e) => setchallenge(e.target.value)} rows={4} className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[2rem] text-[13px] text-gray-600 focus:outline-none focus:border-red-200 focus:bg-white shadow-sm resize-none transition-all" placeholder="What was the main obstacle?" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-green-400 rounded-full" />
          <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Final Solution</label>
        </div>
        <textarea value={solution} onChange={(e) => setsolution(e.target.value)} rows={4} className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[2rem] text-[13px] text-gray-600 focus:outline-none focus:border-green-200 focus:bg-white shadow-sm resize-none transition-all" placeholder="How was it resolved?" />
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center justify-end gap-5 pt-8 border-t border-gray-50">
      {isEditMode && (
        <button onClick={resetform} className="text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
          Discard Changes
        </button>
      )}
      <button onClick={() => setshowconfirmmodal(true)} disabled={isloading} className="px-12 py-4 bg-[#800000] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-maroon-200 hover:scale-[1.02] hover:bg-[#600000] transition-all active:scale-95 disabled:opacity-50">
        {isloading ? 'Processing...' : (isEditMode ? 'Update Database' : 'Publish Study')}
      </button>
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

          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 dark:border-white/5 min-h-[400px]">
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
