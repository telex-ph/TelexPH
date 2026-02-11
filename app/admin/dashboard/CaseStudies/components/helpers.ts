import { CaseStudy } from './types';

export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getstatuscolor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-600';
    case 'Completed': return 'bg-blue-600';
    case 'Draft': return 'bg-gray-600';
    case 'Scheduled': return 'bg-purple-600';
    default: return 'bg-gray-500';
  }
};

export const getstatusbadgecolor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-600';
    case 'Completed': return 'bg-blue-600';
    case 'Draft': return 'bg-gray-600';
    case 'Scheduled': return 'bg-purple-600';
    default: return 'bg-gray-700';
  }
};

export const getcategorybadgecolor = (category: string) => {
  switch (category) {
    case 'Technology': return 'bg-indigo-600';
    case 'Logistics': return 'bg-orange-600';
    case 'Analytics': return 'bg-cyan-600';
    case 'Infrastructure': return 'bg-teal-600';
    default: return 'bg-gray-600';
  }
};

export const validateScheduleTime = (
  date: string, 
  time: string, 
  setTimeError: (error: string | null) => void
): boolean => {
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

export const filterRecords = (
  records: CaseStudy[],
  activetab: string,
  searchquery: string,
  sortby: string,
  filteredcategories: string[]
) => {
  let filtered = records;

  // Filter by status tab
  if (activetab !== 'All') {
    filtered = filtered.filter(r => r.status === activetab);
  }

  // Filter by search query
  if (searchquery) {
    const query = searchquery.toLowerCase();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.author.toLowerCase().includes(query) ||
      r.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }

  // Filter by categories
  if (filteredcategories.length > 0) {
    filtered = filtered.filter(r =>
      r.categories.some(cat => filteredcategories.includes(cat))
    );
  }

  // Sort records
  switch (sortby) {
    case 'Newest':
      filtered.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      break;
    case 'Oldest':
      filtered.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      break;
    case 'A-Z':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'Z-A':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
};

export const getCalendarDays = (monthindex: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const firstday = new Date(year, monthindex, 1);
  const lastday = new Date(year, monthindex + 1, 0);
  const dayscount = lastday.getDate();
  let startday = firstday.getDay();
  if (startday === 0) startday = 7;

  const days: (number | null)[] = [];
  for (let i = 1; i < startday; i++) {
    days.push(null);
  }
  for (let i = 1; i <= dayscount; i++) {
    days.push(i);
  }
  return days;
};

export const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};