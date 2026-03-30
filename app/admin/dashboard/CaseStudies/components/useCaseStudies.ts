import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaseStudy, CaseStudyFormData, ModalState, FilterState, EditState, LoadingState, MessageState } from './types';
import { getCurrentDate, validateScheduleTime as validateTime, filterRecords } from './helpers';

// API Base URL - adjust this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com/api';

// Transform backend data to frontend format
const transformBackendToFrontend = (backendData: any): CaseStudy => {
  return {
    id: backendData._id || backendData.id,
    title: backendData.title,
    subtitle: backendData.subtitle || '',
    author: backendData.author,
    challenge: backendData.challenge && backendData.challenge.length > 0 
      ? backendData.challenge[0].text 
      : '',
    solution: backendData.solution && backendData.solution.length > 0 
      ? backendData.solution[0].text 
      : '',
    result: backendData.solution && backendData.solution.length > 1
      ? backendData.solution[1].text
      : '',
    categories: (backendData.tags || []).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
    status: backendData.status.charAt(0).toUpperCase() + backendData.status.slice(1),
    start: backendData.startDate ? new Date(backendData.startDate).toISOString().split('T')[0] : '',
    end: backendData.endDate ? new Date(backendData.endDate).toISOString().split('T')[0] : '',
    isUnfinished: backendData.isUnfinished || false,
    scheduleDate: backendData.scheduleDate ? new Date(backendData.scheduleDate).toISOString().split('T')[0] : '',
    scheduleTime: backendData.scheduleTime || '',
    image: backendData.cover || '',
    topic1: backendData.sections && backendData.sections[0] ? backendData.sections[0].subtitle : '',
    content1: backendData.sections && backendData.sections[0] ? backendData.sections[0].text : '',
    topic2: backendData.sections && backendData.sections[1] ? backendData.sections[1].subtitle : '',
    content2: backendData.sections && backendData.sections[1] ? backendData.sections[1].text : '',
    topic3: backendData.sections && backendData.sections[2] ? backendData.sections[2].subtitle : '',
    content3: backendData.sections && backendData.sections[2] ? backendData.sections[2].text : '',
    topic4: backendData.sections && backendData.sections[3] ? backendData.sections[3].subtitle : '',
    content4: backendData.sections && backendData.sections[3] ? backendData.sections[3].text : '',
    topic5: backendData.sections && backendData.sections[4] ? backendData.sections[4].subtitle : '',
    content5: backendData.sections && backendData.sections[4] ? backendData.sections[4].text : '',
  };
};

// Transform frontend data to backend format
const transformFrontendToBackend = (formData: CaseStudyFormData) => {
  const formDataToSend = new FormData();
  
  // Basic fields
  formDataToSend.append('title', formData.title);
  if (formData.subtitle) {
    formDataToSend.append('subtitle', formData.subtitle);
  }
  formDataToSend.append('author', formData.author);
  formDataToSend.append('status', formData.status.toLowerCase());
  
  // Tags as comma-separated string
  if (formData.categories.length > 0) {
    formDataToSend.append('tags', formData.categories.map(c => c.toLowerCase()).join(','));
  }
  
  // Add sections as subtitle0/text0, subtitle1/text1, etc.
  for (let i = 0; i < 5; i++) {
    const topicKey = `topic${i + 1}` as keyof CaseStudyFormData;
    const contentKey = `content${i + 1}` as keyof CaseStudyFormData;
    const topic = formData[topicKey] as string || '';
    const content = formData[contentKey] as string || '';
    
    formDataToSend.append(`subtitle${i}`, topic);
    formDataToSend.append(`text${i}`, content);
  }
  
  // Add challenge and solution as strings
  formDataToSend.append('challenge', formData.challenge);
  formDataToSend.append('solution', formData.solution);
  
  // Add dates
  if (formData.startdate) {
    formDataToSend.append('startDate', formData.startdate);
  }
  if (formData.enddate && !formData.isunfinished) {
    formDataToSend.append('endDate', formData.enddate);
  }
  formDataToSend.append('isUnfinished', formData.isunfinished.toString());
  
  // Add schedule info if scheduled
  if (formData.status === 'Scheduled') {
    if (formData.scheduledate) {
      formDataToSend.append('scheduleDate', formData.scheduledate);
    }
    if (formData.scheduletime) {
      formDataToSend.append('scheduleTime', formData.scheduletime);
    }
  }
  
  // Add image if present - field name is 'cover' for backend
  if (formData.selectedfile) {
    formDataToSend.append('cover', formData.selectedfile);
  }
  
  return formDataToSend;
};

export const useCaseStudies = () => {
  const router = useRouter();
  const fileref = useRef<HTMLInputElement>(null);
  
  // Modal states
  const [modalState, setModalState] = useState<ModalState>({
    showconfirmmodal: false,
    showdeletemodal: false,
    showcalendarmodal: false,
    showpreviewmodal: false,
    showdatemodal: false,
  });

  // Filter states
  const [filterState, setFilterState] = useState<FilterState>({
    activetab: 'All',
    searchquery: '',
    sortby: 'Newest',
    filteredcategories: [],
  });

  // Edit states
  const [editState, setEditState] = useState<EditState>({
    isEditMode: false,
    editingId: null,
  });

  // Loading states
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isloading: false,
    isdeleting: false,
  });

  // Message states
  const [messageState, setMessageState] = useState<MessageState>({
    error: null,
    success: null,
    timeError: null,
  });

  // Form data states
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: '',
    subtitle: '',
    author: '',
    challenge: '',
    solution: '',
    result: '',
    categories: ['Technology'],
    status: 'Active',
    startdate: getCurrentDate(),
    enddate: '',
    isunfinished: false,
    scheduledate: getCurrentDate(),
    scheduletime: '09:00',
    selectedimage: null,
    selectedfile: null,
    topic1: '',
    content1: '',
    topic2: '',
    content2: '',
    topic3: '',
    content3: '',
    topic4: '',
    content4: '',
    topic5: '',
    content5: '',
  });

  const [previewdata, setpreviewdata] = useState<any>(null);
  const [deletetarget, setdeletetarget] = useState<any>(null);
  const [selecteddatedata, setselecteddatedata] = useState<any>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const today = new Date();
  const todaystr = today.toISOString().split('T')[0];
  const [selectedmonthindex, setselectedmonthindex] = useState(today.getMonth());
  const [selectedday, setselectedday] = useState(today.getDate());
  
  const [records, setrecords] = useState<CaseStudy[]>([]);

  // Update form field
  const updateFormField = (field: keyof CaseStudyFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // If start date changes and the existing end date is before the new start date, clear end date
      if (field === 'startdate' && updated.enddate && value > updated.enddate) {
        updated.enddate = '';
      }
      // If isunfinished is checked, force status to Draft and clear end date
      if (field === 'isunfinished' && value === true) {
        updated.status = 'Draft';
        updated.enddate = '';
      }
      return updated;
    });
  };

  // Update modal state
  const updateModalState = (field: keyof ModalState, value: boolean) => {
    setModalState(prev => ({ ...prev, [field]: value }));
  };

  // Update filter state
  const updateFilterState = (field: keyof FilterState, value: any) => {
    setFilterState(prev => ({ ...prev, [field]: value }));
  };

  // Update edit state
  const updateEditState = (field: keyof EditState, value: any) => {
    setEditState(prev => ({ ...prev, [field]: value }));
  };

  // Update loading state
  const updateLoadingState = (field: keyof LoadingState, value: boolean) => {
    setLoadingState(prev => ({ ...prev, [field]: value }));
  };

  // Update message state
  const updateMessageState = (field: keyof MessageState, value: string | null) => {
    setMessageState(prev => ({ ...prev, [field]: value }));
  };

  // Check and update scheduled studies
  const checkAndUpdateScheduledStudies = async () => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const scheduledRecords = records.filter(r => r.status === 'Scheduled');

    for (const record of scheduledRecords) {
      if (record.scheduleDate && record.scheduleTime) {
        const scheduleDateStr = record.scheduleDate;
        const scheduleTimeStr = record.scheduleTime;

        const isPast = scheduleDateStr < currentDateStr || 
                      (scheduleDateStr === currentDateStr && scheduleTimeStr <= currentTime);

        if (isPast) {
          try {
            const formDataToSend = new FormData();
            formDataToSend.append('status', 'active');

            const response = await fetch(`${API_BASE_URL}/casestudies/${record.id}`, {
              method: 'PATCH',
              body: formDataToSend,
              credentials: 'include',
            });

            if (response.ok) {
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

  // Validate schedule time
  const validateScheduleTime = (date: string, time: string): boolean => {
    return validateTime(date, time, (error) => updateMessageState('timeError', error));
  };

  // Handle schedule time change
  const handleScheduleTimeChange = (newTime: string) => {
    updateFormField('scheduletime', newTime);
    if (formData.status === 'Scheduled' && formData.scheduledate) {
      validateScheduleTime(formData.scheduledate, newTime);
    }
  };

  // Handle schedule date change
  const handleScheduleDateChange = (newDate: string) => {
    updateFormField('scheduledate', newDate);
    if (formData.status === 'Scheduled' && formData.scheduletime) {
      validateScheduleTime(newDate, formData.scheduletime);
    }
  };

  // Fetch case studies
  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/casestudies`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch case studies');
      }
      
      const data = await response.json();
      const transformedData = data.map((item: any) => transformBackendToFrontend(item));
      setrecords(transformedData);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      updateMessageState('error', 'Failed to load case studies');
    }
  };

  // Handle file change
  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        updateMessageState('error', 'Invalid file type. Only PNG, JPG, JPEG, and WebP images are allowed.');
        if (fileref.current) fileref.current.value = '';
        setTimeout(() => updateMessageState('error', null), 4000);
        return;
      }
      updateMessageState('error', null);
      updateFormField('selectedfile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormField('selectedimage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle category toggle
  const togglecategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setFilterState(prev => ({
      ...prev,
      filteredcategories: prev.filteredcategories.includes(category)
        ? prev.filteredcategories.filter(c => c !== category)
        : [...prev.filteredcategories, category]
    }));
  };

  // Reset form
  const resetform = () => {
    setFormData({
      title: '',
      subtitle: '',
      author: '',
      challenge: '',
      solution: '',
      result: '',
      categories: ['Technology'],
      status: 'Active',
      startdate: getCurrentDate(),
      enddate: '',
      isunfinished: false,
      scheduledate: getCurrentDate(),
      scheduletime: '09:00',
      selectedimage: null,
      selectedfile: null,
      topic1: '',
      content1: '',
      topic2: '',
      content2: '',
      topic3: '',
      content3: '',
      topic4: '',
      content4: '',
      topic5: '',
      content5: '',
    });
    setEditState({ isEditMode: false, editingId: null });
    updateMessageState('error', null);
    updateMessageState('success', null);
    updateMessageState('timeError', null);
    if (fileref.current) fileref.current.value = '';
  };

  // Validate form — runs all checks BEFORE opening confirm modal
  const validateform = () => {
    updateMessageState('error', null);
    updateMessageState('success', null);

    if (!formData.title.trim() || !formData.author.trim()) {
      updateMessageState('error', 'Title and Author are required');
      setTimeout(() => updateMessageState('error', null), 5000);
      return;
    }

    // Challenge and solution required for non-Draft only
    if (formData.status !== 'Draft') {
      if (!formData.challenge.trim()) {
        updateMessageState('error', 'Challenge is required');
        setTimeout(() => updateMessageState('error', null), 5000);
        return;
      }

      if (!formData.solution.trim()) {
        updateMessageState('error', 'Solution is required');
        setTimeout(() => updateMessageState('error', null), 5000);
        return;
      }

      // At least one full content section required for non-Draft
      const hasContent = [1, 2, 3, 4, 5].some(num => {
        const topicKey = `topic${num}` as keyof CaseStudyFormData;
        const contentKey = `content${num}` as keyof CaseStudyFormData;
        return (formData[topicKey] as string).trim() && (formData[contentKey] as string).trim();
      });

      if (!hasContent) {
        updateMessageState('error', 'At least one content section is required');
        setTimeout(() => updateMessageState('error', null), 5000);
        return;
      }

      // End date required for Active, Completed, Scheduled — unless marked Unfinished
      const statusesRequiringEndDate = ['Active', 'Completed', 'Scheduled'];
      if (statusesRequiringEndDate.includes(formData.status) && !formData.isunfinished && !formData.enddate.trim()) {
        updateMessageState('error', 'An end date is required to set the status to Active, Completed, or Scheduled. Please provide an end date or mark the study as Unfinished.');
        setTimeout(() => updateMessageState('error', null), 6000);
        return;
      }
    }

    if (formData.status === 'Scheduled') {
      if (!formData.scheduledate || !formData.scheduletime) {
        updateMessageState('error', 'Schedule date and time are required for scheduled studies');
        setTimeout(() => updateMessageState('error', null), 5000);
        return;
      }
      if (!validateScheduleTime(formData.scheduledate, formData.scheduletime)) {
        return;
      }
    }

    // Cover image required for new case studies only
    if (!editState.isEditMode && !formData.selectedfile) {
      updateMessageState('error', 'Cover image is required');
      setTimeout(() => updateMessageState('error', null), 5000);
      return;
    }

    // All validations passed — open confirm modal
    updateModalState('showconfirmmodal', true);
  };

  // Handle submit — only called after user clicks Confirm in the modal
  const handlesubmit = async () => {
    try {
      updateLoadingState('isloading', true);
      updateMessageState('error', null);
      updateMessageState('success', null);

      const formDataToSend = transformFrontendToBackend(formData);

      const url = editState.isEditMode 
        ? `${API_BASE_URL}/casestudies/${editState.editingId}`
        : `${API_BASE_URL}/casestudies`;
      
      const method = editState.isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save case study');
      }

      updateMessageState('success', editState.isEditMode ? 'Case study updated successfully!' : 'Case study created successfully!');
      await fetchCaseStudies();
      resetform();
      updateModalState('showconfirmmodal', false);

      setTimeout(() => {
        updateMessageState('success', null);
      }, 3000);
    } catch (error: any) {
      console.error('Submission error:', error);
      updateMessageState('error', error.message || 'An error occurred');
    } finally {
      updateLoadingState('isloading', false);
    }
  };

  // Handle edit
  const handleedit = (rec: CaseStudy) => {
    setFormData({
      title: rec.title,
      subtitle: rec.subtitle || '',
      author: rec.author,
      challenge: rec.challenge,
      solution: rec.solution,
      result: rec.result || '',
      categories: rec.categories,
      status: rec.status,
      startdate: rec.start,
      enddate: rec.end || '',
      isunfinished: rec.isUnfinished,
      scheduledate: rec.scheduleDate || getCurrentDate(),
      scheduletime: rec.scheduleTime || '09:00',
      selectedimage: rec.image || null,
      selectedfile: null,
      topic1: rec.topic1 || '',
      content1: rec.content1 || '',
      topic2: rec.topic2 || '',
      content2: rec.content2 || '',
      topic3: rec.topic3 || '',
      content3: rec.content3 || '',
      topic4: rec.topic4 || '',
      content4: rec.content4 || '',
      topic5: rec.topic5 || '',
      content5: rec.content5 || '',
    });
    setEditState({ isEditMode: true, editingId: rec.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle archive click (replaces delete)
  const handledeleteclick = (rec: CaseStudy) => {
    setdeletetarget(rec);
    updateModalState('showdeletemodal', true);
  };

  // Handle archive confirm
  const handledeleteconfirm = async () => {
    if (!deletetarget) return;

    try {
      updateLoadingState('isdeleting', true);
      const response = await fetch(`${API_BASE_URL}/casestudies/${deletetarget.id}/archive`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to archive');

      await fetchCaseStudies();
      updateModalState('showdeletemodal', false);
      setdeletetarget(null);
      updateMessageState('success', 'Case study archived successfully');

      setTimeout(() => {
        updateMessageState('success', null);
      }, 3000);
    } catch (error) {
      updateMessageState('error', 'Failed to archive case study');
    } finally {
      updateLoadingState('isdeleting', false);
    }
  };

  // Handle preview
  const handlepreview = (rec: CaseStudy) => {
    setpreviewdata(rec);
    updateModalState('showpreviewmodal', true);
  };

  // Handle day click in calendar
  const handledayclick = (day: number) => {
    setselectedday(day);
    const dateStr = `${new Date().getFullYear()}-${String(selectedmonthindex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const studiesOnDate = records.filter(r => r.start === dateStr);
    
    if (studiesOnDate.length > 0) {
      setselecteddatedata({ date: dateStr, studies: studiesOnDate });
      updateModalState('showdatemodal', true);
    }
  };

  // Filtered records
  const filteredrecords = useMemo(() => {
    return filterRecords(
      records,
      filterState.activetab,
      filterState.searchquery,
      filterState.sortby,
      filterState.filteredcategories
    );
  }, [records, filterState]);

  // Fetch on mount and set up interval
  useEffect(() => {
    fetchCaseStudies();
    const interval = setInterval(() => {
      checkAndUpdateScheduledStudies();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    // States
    formData,
    modalState,
    filterState,
    editState,
    loadingState,
    messageState,
    records,
    filteredrecords,
    previewdata,
    deletetarget,
    selecteddatedata,
    showCategoryDropdown,
    selectedmonthindex,
    selectedday,
    today,
    todaystr,
    fileref,
    router,
    
    // Functions
    updateFormField,
    updateModalState,
    updateFilterState,
    updateEditState,
    updateLoadingState,
    updateMessageState,
    handlefilechange,
    togglecategory,
    toggleCategoryFilter,
    resetform,
    validateform,
    handlesubmit,
    handleedit,
    handledeleteclick,
    handledeleteconfirm,
    handlepreview,
    handledayclick,
    handleScheduleTimeChange,
    handleScheduleDateChange,
    setShowCategoryDropdown,
    setselectedmonthindex,
    setselectedday,
    fetchCaseStudies,
  };
};