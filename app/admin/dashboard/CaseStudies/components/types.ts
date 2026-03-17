export interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  challenge: string;
  solution: string;
  result: string;
  categories: string[];
  status: string;
  start: string;
  end?: string;
  isUnfinished: boolean;
  scheduleDate?: string;
  scheduleTime?: string;
  image?: string;
  topic1?: string;
  content1?: string;
  topic2?: string;
  content2?: string;
  topic3?: string;
  content3?: string;
  topic4?: string;
  content4?: string;
  topic5?: string;
  content5?: string;
}

export interface CaseStudyFormData {
  title: string;
  subtitle: string;
  author: string;
  challenge: string;
  solution: string;
  result: string;
  categories: string[];
  status: string;
  startdate: string;
  enddate: string;
  isunfinished: boolean;
  scheduledate: string;
  scheduletime: string;
  selectedimage: string | null;
  selectedfile: File | null;
  topic1: string;
  content1: string;
  topic2: string;
  content2: string;
  topic3: string;
  content3: string;
  topic4: string;
  content4: string;
  topic5: string;
  content5: string;
}

export interface ModalState {
  showconfirmmodal: boolean;
  showdeletemodal: boolean;
  showcalendarmodal: boolean;
  showpreviewmodal: boolean;
  showdatemodal: boolean;
}

export interface FilterState {
  activetab: string;
  searchquery: string;
  sortby: string;
  filteredcategories: string[];
}

export interface EditState {
  isEditMode: boolean;
  editingId: string | null;
}

export interface LoadingState {
  isloading: boolean;
  isdeleting: boolean;
}

export interface MessageState {
  error: string | null;
  success: string | null;
  timeError: string | null;
}