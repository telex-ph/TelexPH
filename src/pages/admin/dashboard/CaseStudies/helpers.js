const getCurrentDate = () => {
  const now = /* @__PURE__ */ new Date();
  return now.toISOString().split("T")[0];
};
const getstatuscolor = (status) => {
  switch (status) {
    case "Active":
      return "bg-[#10B981]";
    case "Completed":
      return "bg-[#3B82F6]";
    case "Draft":
      return "bg-[#9CA3AF]";
    case "Scheduled":
      return "bg-[#F59E0B]";
    default:
      return "bg-gray-500";
  }
};
const getstatusbadgecolor = (status) => {
  switch (status) {
    case "Active":
      return "bg-[#10B981]";
    case "Completed":
      return "bg-[#3B82F6]";
    case "Draft":
      return "bg-[#9CA3AF]";
    case "Scheduled":
      return "bg-[#F59E0B]";
    default:
      return "bg-gray-700";
  }
};
const getcategorybadgecolor = (category) => {
  switch (category) {
    case "Technology":
      return "bg-[#0EA5E9]";
    case "Logistics":
      return "bg-[#FF6B4A]";
    case "Analytics":
      return "bg-[#A855F7]";
    case "Infrastructure":
      return "bg-[#06B6D4]";
    default:
      return "bg-gray-600";
  }
};
const validateScheduleTime = (date, time, setTimeError) => {
  const now = /* @__PURE__ */ new Date();
  const currentDateStr = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);
  if (date === currentDateStr) {
    if (time <= currentTime) {
      setTimeError(`Cannot schedule for ${time} - time has already passed today. Current time is ${currentTime}.`);
      return false;
    }
  }
  setTimeError(null);
  return true;
};
const filterRecords = (records, activetab, searchquery, sortby, filteredcategories) => {
  let filtered = records;
  if (activetab !== "All") {
    filtered = filtered.filter((r) => r.status === activetab);
  }
  if (searchquery) {
    const query = searchquery.toLowerCase();
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(query) || r.author.toLowerCase().includes(query) || r.categories.some((cat) => cat.toLowerCase().includes(query))
    );
  }
  if (filteredcategories.length > 0) {
    filtered = filtered.filter(
      (r) => r.categories.some((cat) => filteredcategories.includes(cat))
    );
  }
  switch (sortby) {
    case "Newest":
      filtered.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      break;
    case "Oldest":
      filtered.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      break;
    case "A-Z":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Z-A":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  return filtered;
};
const getCalendarDays = (monthindex) => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const firstday = new Date(year, monthindex, 1);
  const lastday = new Date(year, monthindex + 1, 0);
  const dayscount = lastday.getDate();
  let startday = firstday.getDay();
  if (startday === 0) startday = 7;
  const days = [];
  for (let i = 1; i < startday; i++) {
    days.push(null);
  }
  for (let i = 1; i <= dayscount; i++) {
    days.push(i);
  }
  return days;
};
const formatDateForDisplay = (dateStr) => {
  const date = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
export {
  filterRecords,
  formatDateForDisplay,
  getCalendarDays,
  getCurrentDate,
  getcategorybadgecolor,
  getstatusbadgecolor,
  getstatuscolor,
  validateScheduleTime
};
