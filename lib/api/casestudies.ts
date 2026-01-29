// lib/api/casestudies.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAllCaseStudies() {
  const response = await fetch(`${API_BASE_URL}/casestudies`);
  if (!response.ok) throw new Error('Failed to fetch case studies');
  return response.json();
}

export async function getCaseStudy(id: string) {
  const response = await fetch(`${API_BASE_URL}/casestudies/${id}`);
  if (!response.ok) throw new Error('Failed to fetch case study');
  return response.json();
}