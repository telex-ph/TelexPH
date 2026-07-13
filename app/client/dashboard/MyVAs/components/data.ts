export type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done'; priority: 'high' | 'medium' | 'low'; dueDate: string }
export type Milestone = { id: string; title: string; dueDate: string; completed: boolean }
export type HireMessage = { id: string; from: 'client' | 'va'; text: string; time: string }

export type HiredVA = {
  id: string
  vaId: string
  name: string
  avatar: string
  role: string
  contractType: string
  startDate: string
  status: 'active' | 'pending'
  hoursThisCycle: number
  rate: number
  tasks: Task[]
  milestones: Milestone[]
  messages: HireMessage[]
}

export const HIRED_VAS: HiredVA[] = [
  {
    id: 'hire-1', vaId: 'va-004', name: 'Carlo Mendoza', avatar: 'CM', role: 'Social Media Manager',
    contractType: 'Full-Time (40 hrs/wk)', startDate: 'Mar 1, 2026', status: 'active',
    hoursThisCycle: 132, rate: 11,
    tasks: [
      { id: 't1', title: 'Complete onboarding questionnaire', status: 'done', priority: 'high', dueDate: 'Mar 3' },
      { id: 't2', title: 'Share brand kit & tone guidelines', status: 'done', priority: 'high', dueDate: 'Mar 4' },
      { id: 't3', title: 'Set up communication channels', status: 'in-progress', priority: 'medium', dueDate: 'Mar 8' },
      { id: 't4', title: 'Review and approve content calendar', status: 'in-progress', priority: 'high', dueDate: 'Mar 12' },
      { id: 't5', title: 'First weekly performance report', status: 'todo', priority: 'medium', dueDate: 'Mar 18' },
    ],
    milestones: [
      { id: 'm1', title: 'Onboarding Complete', dueDate: 'Mar 5', completed: true },
      { id: 'm2', title: 'First Deliverable Submitted', dueDate: 'Mar 15', completed: false },
      { id: 'm3', title: '30-Day Review', dueDate: 'Apr 1', completed: false },
    ],
    messages: [
      { id: 'msg1', from: 'va', text: 'Hey! I reviewed your brief — looking forward to working with you.', time: '9:48 AM' },
      { id: 'msg2', from: 'client', text: 'Great, looking forward to it! Let me know if you need anything.', time: '9:52 AM' },
    ],
  },
  {
    id: 'hire-2', vaId: 'va-001', name: 'Maria Santos', avatar: 'MS', role: 'Customer Service Specialist',
    contractType: 'Part-Time (20 hrs/wk)', startDate: 'Jan 12, 2026', status: 'active',
    hoursThisCycle: 78, rate: 12,
    tasks: [
      { id: 't6', title: 'Migrate ticket macros to Zendesk', status: 'done', priority: 'high', dueDate: 'Jan 20' },
      { id: 't7', title: 'Weekly CSAT summary', status: 'in-progress', priority: 'medium', dueDate: 'Jul 17' },
      { id: 't8', title: 'Draft holiday coverage plan', status: 'todo', priority: 'low', dueDate: 'Jul 25' },
    ],
    milestones: [
      { id: 'm4', title: 'Onboarding Complete', dueDate: 'Jan 15', completed: true },
      { id: 'm5', title: '90-Day Review', dueDate: 'Apr 12', completed: true },
      { id: 'm6', title: 'Contract Renewal Check', dueDate: 'Jul 31', completed: false },
    ],
    messages: [
      { id: 'msg3', from: 'va', text: 'CSAT is at 96% this week — sharing the full report shortly.', time: 'Yesterday' },
    ],
  },
]

export const TASK_STATUS_META: Record<Task['status'], { label: string; bg: string; color: string; border: string }> = {
  'todo': { label: 'To Do', bg: '#f5f5f8', color: '#555', border: '#e0dde8' },
  'in-progress': { label: 'In Progress', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'done': { label: 'Done', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

export const PRIORITY_META: Record<Task['priority'], { color: string }> = {
  high: { color: '#ef4444' },
  medium: { color: '#f59e0b' },
  low: { color: '#22c55e' },
}
