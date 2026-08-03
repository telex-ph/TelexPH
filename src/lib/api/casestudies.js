const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";
async function getAllCaseStudies() {
  const response = await fetch(`${API_BASE_URL}/casestudies`);
  if (!response.ok) throw new Error("Failed to fetch case studies");
  return response.json();
}
async function getCaseStudy(id) {
  const response = await fetch(`${API_BASE_URL}/casestudies/${id}`);
  if (!response.ok) throw new Error("Failed to fetch case study");
  return response.json();
}
export {
  getAllCaseStudies,
  getCaseStudy
};
