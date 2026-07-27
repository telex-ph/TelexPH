import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDate, validateScheduleTime as validateTime, filterRecords } from "./helpers";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://telexph-admin.onrender.com/api";
const transformBackendToFrontend = (backendData) => {
  return {
    id: backendData._id || backendData.id,
    title: backendData.title,
    subtitle: backendData.subtitle || "",
    author: backendData.author,
    challenge: backendData.challenge && backendData.challenge.length > 0 ? backendData.challenge[0].text : "",
    solution: backendData.solution && backendData.solution.length > 0 ? backendData.solution[0].text : "",
    result: backendData.solution && backendData.solution.length > 1 ? backendData.solution[1].text : "",
    categories: (backendData.tags || []).map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    status: backendData.status.charAt(0).toUpperCase() + backendData.status.slice(1),
    start: backendData.startDate ? new Date(backendData.startDate).toISOString().split("T")[0] : "",
    end: backendData.endDate ? new Date(backendData.endDate).toISOString().split("T")[0] : "",
    isUnfinished: backendData.isUnfinished || false,
    scheduleDate: backendData.scheduleDate ? new Date(backendData.scheduleDate).toISOString().split("T")[0] : "",
    scheduleTime: backendData.scheduleTime || "",
    image: backendData.cover || "",
    topic1: backendData.sections && backendData.sections[0] ? backendData.sections[0].subtitle : "",
    content1: backendData.sections && backendData.sections[0] ? backendData.sections[0].text : "",
    topic2: backendData.sections && backendData.sections[1] ? backendData.sections[1].subtitle : "",
    content2: backendData.sections && backendData.sections[1] ? backendData.sections[1].text : "",
    topic3: backendData.sections && backendData.sections[2] ? backendData.sections[2].subtitle : "",
    content3: backendData.sections && backendData.sections[2] ? backendData.sections[2].text : "",
    topic4: backendData.sections && backendData.sections[3] ? backendData.sections[3].subtitle : "",
    content4: backendData.sections && backendData.sections[3] ? backendData.sections[3].text : "",
    topic5: backendData.sections && backendData.sections[4] ? backendData.sections[4].subtitle : "",
    content5: backendData.sections && backendData.sections[4] ? backendData.sections[4].text : ""
  };
};
const transformFrontendToBackend = (formData) => {
  const formDataToSend = new FormData();
  formDataToSend.append("title", formData.title);
  if (formData.subtitle) {
    formDataToSend.append("subtitle", formData.subtitle);
  }
  formDataToSend.append("author", formData.author);
  formDataToSend.append("status", formData.status.toLowerCase());
  if (formData.categories.length > 0) {
    formDataToSend.append("tags", formData.categories.map((c) => c.toLowerCase()).join(","));
  }
  for (let i = 0; i < 5; i++) {
    const topicKey = `topic${i + 1}`;
    const contentKey = `content${i + 1}`;
    const topic = formData[topicKey] || "";
    const content = formData[contentKey] || "";
    formDataToSend.append(`subtitle${i}`, topic);
    formDataToSend.append(`text${i}`, content);
  }
  formDataToSend.append("challenge", formData.challenge);
  formDataToSend.append("solution", formData.solution);
  if (formData.startdate) {
    formDataToSend.append("startDate", formData.startdate);
  }
  if (formData.enddate && !formData.isunfinished) {
    formDataToSend.append("endDate", formData.enddate);
  }
  formDataToSend.append("isUnfinished", formData.isunfinished.toString());
  if (formData.status === "Scheduled") {
    if (formData.scheduledate) {
      formDataToSend.append("scheduleDate", formData.scheduledate);
    }
    if (formData.scheduletime) {
      formDataToSend.append("scheduleTime", formData.scheduletime);
    }
  }
  if (formData.selectedfile) {
    formDataToSend.append("cover", formData.selectedfile);
  }
  return formDataToSend;
};
const useCaseStudies = () => {
  const router = useRouter();
  const fileref = useRef(null);
  const [modalState, setModalState] = useState({
    showconfirmmodal: false,
    showdeletemodal: false,
    showcalendarmodal: false,
    showpreviewmodal: false,
    showdatemodal: false
  });
  const [filterState, setFilterState] = useState({
    activetab: "All",
    searchquery: "",
    sortby: "Newest",
    filteredcategories: []
  });
  const [editState, setEditState] = useState({
    isEditMode: false,
    editingId: null
  });
  const [loadingState, setLoadingState] = useState({
    isloading: false,
    isdeleting: false
  });
  const [messageState, setMessageState] = useState({
    error: null,
    success: null,
    timeError: null
  });
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    challenge: "",
    solution: "",
    result: "",
    categories: ["Technology"],
    status: "Active",
    startdate: getCurrentDate(),
    enddate: "",
    isunfinished: false,
    scheduledate: getCurrentDate(),
    scheduletime: "09:00",
    selectedimage: null,
    selectedfile: null,
    topic1: "",
    content1: "",
    topic2: "",
    content2: "",
    topic3: "",
    content3: "",
    topic4: "",
    content4: "",
    topic5: "",
    content5: ""
  });
  const [previewdata, setpreviewdata] = useState(null);
  const [deletetarget, setdeletetarget] = useState(null);
  const [selecteddatedata, setselecteddatedata] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const today = /* @__PURE__ */ new Date();
  const todaystr = today.toISOString().split("T")[0];
  const [selectedmonthindex, setselectedmonthindex] = useState(today.getMonth());
  const [selectedday, setselectedday] = useState(today.getDate());
  const [records, setrecords] = useState([]);
  const updateFormField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "startdate" && updated.enddate && value > updated.enddate) {
        updated.enddate = "";
      }
      if (field === "isunfinished" && value === true) {
        updated.status = "Draft";
        updated.enddate = "";
      }
      return updated;
    });
  };
  const updateModalState = (field, value) => {
    setModalState((prev) => ({ ...prev, [field]: value }));
  };
  const updateFilterState = (field, value) => {
    setFilterState((prev) => ({ ...prev, [field]: value }));
  };
  const updateEditState = (field, value) => {
    setEditState((prev) => ({ ...prev, [field]: value }));
  };
  const updateLoadingState = (field, value) => {
    setLoadingState((prev) => ({ ...prev, [field]: value }));
  };
  const updateMessageState = (field, value) => {
    setMessageState((prev) => ({ ...prev, [field]: value }));
  };
  const checkAndUpdateScheduledStudies = async () => {
    const now = /* @__PURE__ */ new Date();
    const currentDateStr = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);
    const scheduledRecords = records.filter((r) => r.status === "Scheduled");
    for (const record of scheduledRecords) {
      if (record.scheduleDate && record.scheduleTime) {
        const scheduleDateStr = record.scheduleDate;
        const scheduleTimeStr = record.scheduleTime;
        const isPast = scheduleDateStr < currentDateStr || scheduleDateStr === currentDateStr && scheduleTimeStr <= currentTime;
        if (isPast) {
          try {
            const formDataToSend = new FormData();
            formDataToSend.append("status", "active");
            const response = await fetch(`${API_BASE_URL}/casestudies/${record.id}`, {
              method: "PATCH",
              body: formDataToSend,
              credentials: "include"
            });
            if (response.ok) {
              setrecords((prev) => prev.map((r) => r.id === record.id ? {
                ...r,
                status: "Active"
              } : r));
            }
          } catch (error) {
            console.error("Error updating scheduled case study:", error);
          }
        }
      }
    }
  };
  const validateScheduleTime = (date, time) => {
    return validateTime(date, time, (error) => updateMessageState("timeError", error));
  };
  const handleScheduleTimeChange = (newTime) => {
    updateFormField("scheduletime", newTime);
    if (formData.status === "Scheduled" && formData.scheduledate) {
      validateScheduleTime(formData.scheduledate, newTime);
    }
  };
  const handleScheduleDateChange = (newDate) => {
    updateFormField("scheduledate", newDate);
    if (formData.status === "Scheduled" && formData.scheduletime) {
      validateScheduleTime(newDate, formData.scheduletime);
    }
  };
  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/casestudies`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch case studies");
      }
      const data = await response.json();
      const transformedData = data.map((item) => transformBackendToFrontend(item));
      setrecords(transformedData);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      updateMessageState("error", "Failed to load case studies");
    }
  };
  const handlefilechange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        updateMessageState("error", "Invalid file type. Only PNG, JPG, JPEG, and WebP images are allowed.");
        if (fileref.current) fileref.current.value = "";
        setTimeout(() => updateMessageState("error", null), 4e3);
        return;
      }
      updateMessageState("error", null);
      updateFormField("selectedfile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormField("selectedimage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const togglecategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category) ? prev.categories.filter((c) => c !== category) : [...prev.categories, category]
    }));
  };
  const toggleCategoryFilter = (category) => {
    setFilterState((prev) => ({
      ...prev,
      filteredcategories: prev.filteredcategories.includes(category) ? prev.filteredcategories.filter((c) => c !== category) : [...prev.filteredcategories, category]
    }));
  };
  const resetform = () => {
    setFormData({
      title: "",
      subtitle: "",
      author: "",
      challenge: "",
      solution: "",
      result: "",
      categories: ["Technology"],
      status: "Active",
      startdate: getCurrentDate(),
      enddate: "",
      isunfinished: false,
      scheduledate: getCurrentDate(),
      scheduletime: "09:00",
      selectedimage: null,
      selectedfile: null,
      topic1: "",
      content1: "",
      topic2: "",
      content2: "",
      topic3: "",
      content3: "",
      topic4: "",
      content4: "",
      topic5: "",
      content5: ""
    });
    setEditState({ isEditMode: false, editingId: null });
    updateMessageState("error", null);
    updateMessageState("success", null);
    updateMessageState("timeError", null);
    if (fileref.current) fileref.current.value = "";
  };
  const validateform = () => {
    updateMessageState("error", null);
    updateMessageState("success", null);
    if (!formData.title.trim() || !formData.author.trim()) {
      updateMessageState("error", "Title and Author are required");
      setTimeout(() => updateMessageState("error", null), 5e3);
      return;
    }
    if (formData.status !== "Draft") {
      if (!formData.challenge.trim()) {
        updateMessageState("error", "Challenge is required");
        setTimeout(() => updateMessageState("error", null), 5e3);
        return;
      }
      if (!formData.solution.trim()) {
        updateMessageState("error", "Solution is required");
        setTimeout(() => updateMessageState("error", null), 5e3);
        return;
      }
      const hasContent = [1, 2, 3, 4, 5].some((num) => {
        const topicKey = `topic${num}`;
        const contentKey = `content${num}`;
        return formData[topicKey].trim() && formData[contentKey].trim();
      });
      if (!hasContent) {
        updateMessageState("error", "At least one content section is required");
        setTimeout(() => updateMessageState("error", null), 5e3);
        return;
      }
      const statusesRequiringEndDate = ["Active", "Completed", "Scheduled"];
      if (statusesRequiringEndDate.includes(formData.status) && !formData.isunfinished && !formData.enddate.trim()) {
        updateMessageState("error", "An end date is required to set the status to Active, Completed, or Scheduled. Please provide an end date or mark the study as Unfinished.");
        setTimeout(() => updateMessageState("error", null), 6e3);
        return;
      }
    }
    if (formData.status === "Scheduled") {
      if (!formData.scheduledate || !formData.scheduletime) {
        updateMessageState("error", "Schedule date and time are required for scheduled studies");
        setTimeout(() => updateMessageState("error", null), 5e3);
        return;
      }
      if (!validateScheduleTime(formData.scheduledate, formData.scheduletime)) {
        return;
      }
    }
    if (!editState.isEditMode && !formData.selectedfile) {
      updateMessageState("error", "Cover image is required");
      setTimeout(() => updateMessageState("error", null), 5e3);
      return;
    }
    updateModalState("showconfirmmodal", true);
  };
  const handlesubmit = async () => {
    try {
      updateLoadingState("isloading", true);
      updateMessageState("error", null);
      updateMessageState("success", null);
      const formDataToSend = transformFrontendToBackend(formData);
      const url = editState.isEditMode ? `${API_BASE_URL}/casestudies/${editState.editingId}` : `${API_BASE_URL}/casestudies`;
      const method = editState.isEditMode ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: "include"
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save case study");
      }
      updateMessageState("success", editState.isEditMode ? "Case study updated successfully!" : "Case study created successfully!");
      await fetchCaseStudies();
      resetform();
      updateModalState("showconfirmmodal", false);
      setTimeout(() => {
        updateMessageState("success", null);
      }, 3e3);
    } catch (error) {
      console.error("Submission error:", error);
      updateMessageState("error", error.message || "An error occurred");
    } finally {
      updateLoadingState("isloading", false);
    }
  };
  const handleedit = (rec) => {
    setFormData({
      title: rec.title,
      subtitle: rec.subtitle || "",
      author: rec.author,
      challenge: rec.challenge,
      solution: rec.solution,
      result: rec.result || "",
      categories: rec.categories,
      status: rec.status,
      startdate: rec.start,
      enddate: rec.end || "",
      isunfinished: rec.isUnfinished,
      scheduledate: rec.scheduleDate || getCurrentDate(),
      scheduletime: rec.scheduleTime || "09:00",
      selectedimage: rec.image || null,
      selectedfile: null,
      topic1: rec.topic1 || "",
      content1: rec.content1 || "",
      topic2: rec.topic2 || "",
      content2: rec.content2 || "",
      topic3: rec.topic3 || "",
      content3: rec.content3 || "",
      topic4: rec.topic4 || "",
      content4: rec.content4 || "",
      topic5: rec.topic5 || "",
      content5: rec.content5 || ""
    });
    setEditState({ isEditMode: true, editingId: rec.id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handledeleteclick = (rec) => {
    setdeletetarget(rec);
    updateModalState("showdeletemodal", true);
  };
  const handledeleteconfirm = async () => {
    if (!deletetarget) return;
    try {
      updateLoadingState("isdeleting", true);
      const response = await fetch(`${API_BASE_URL}/casestudies/${deletetarget.id}/archive`, {
        method: "PATCH",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to archive");
      await fetchCaseStudies();
      updateModalState("showdeletemodal", false);
      setdeletetarget(null);
      updateMessageState("success", "Case study archived successfully");
      setTimeout(() => {
        updateMessageState("success", null);
      }, 3e3);
    } catch (error) {
      updateMessageState("error", "Failed to archive case study");
    } finally {
      updateLoadingState("isdeleting", false);
    }
  };
  const handlepreview = (rec) => {
    setpreviewdata(rec);
    updateModalState("showpreviewmodal", true);
  };
  const handledayclick = (day) => {
    setselectedday(day);
    const dateStr = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String(selectedmonthindex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const studiesOnDate = records.filter((r) => r.start === dateStr);
    if (studiesOnDate.length > 0) {
      setselecteddatedata({ date: dateStr, studies: studiesOnDate });
      updateModalState("showdatemodal", true);
    }
  };
  const filteredrecords = useMemo(() => {
    return filterRecords(
      records,
      filterState.activetab,
      filterState.searchquery,
      filterState.sortby,
      filterState.filteredcategories
    );
  }, [records, filterState]);
  useEffect(() => {
    fetchCaseStudies();
    const interval = setInterval(() => {
      checkAndUpdateScheduledStudies();
    }, 6e4);
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
    fetchCaseStudies
  };
};
export {
  useCaseStudies
};
