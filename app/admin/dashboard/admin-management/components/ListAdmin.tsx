'use client'
 
import React, { useState, useEffect } from 'react'
import EditAdmin from './EditAdmin'
import { useDarkMode } from '../../layout'
 
export default function ListAdmin() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
 
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const [viewingAdmin, setViewingAdmin] = useState<any>(null);
 
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const { isdarkmode } = useDarkMode();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Department mapping
  const departments: { [key: number]: string } = {
    1: 'Compliance',
    2: 'Innovation',
    3: 'Marketing',
    4: 'Recruitment',
    5: 'Human Resources'
  };

  // Role mapping
  const roles: { [key: number]: string } = {
    1: 'Main Administrator',
    2: 'Administrator'
  };

  const departmentList = Object.entries(departments).map(([key, value]) => ({
    id: parseInt(key),
    name: value
  }));

  const roleList = Object.entries(roles).map(([key, value]) => ({
    id: parseInt(key),
    name: value
  }));

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch admins: ${response.status}`);
      }
      
      const data = await response.json();
      setAdmins(data);
    } catch (err: any) {
      console.error('Error loading admins:', err);
      setError(err.message || 'Failed to load admins. Please try again later.');
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    loadAdmins();
  }, []);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedDepartment, selectedRole]);
 
  const cardShadow = { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.03)' };
 
  const getRoleStyles = (role: number) => {
    switch (role) {
      case 1: return 'bg-[#800000] text-white';
      case 2: return 'bg-[#FF4500] text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDepartmentIcon = (dept: number) => {
    const iconMap: Record<number, string> = {
      1: '⚖️',  // Compliance
      2: '💡',  // Innovation
      3: '📢',  // Marketing
      4: '👥',  // Recruitment
      5: '🤝',  // Human Resources
    };
    return iconMap[dept] || '👤';
  };
 
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleEdit = (admin: any) => {
    setSelectedAdmin(admin);
    setIsEditing(true);
  };

  const handleView = (admin: any) => {
    setViewingAdmin(admin);
  };

  const closeViewModal = () => {
    setViewingAdmin(null);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
  };

  const handleSaveEdit = () => {
    loadAdmins();
    closeEditModal();
  };

  const confirmDelete = (id: string) => {
    setAdminToDelete(id);
  };

  const cancelDelete = () => {
    setAdminToDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete admin');
      }

      loadAdmins();
      setAdminToDelete(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    }
  };

  const getFilteredAdmins = () => {
    let filtered = admins;

    // Filter by department
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(admin => 
        admin.department === parseInt(selectedDepartment)
      );
    }

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(admin => 
        admin.role === parseInt(selectedRole)
      );
    }

    return filtered;
  };

  const filteredAdmins = getFilteredAdmins();
  const totalPages = Math.ceil(filteredAdmins.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredAdmins.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getUserInitials = (admin: any) => {
    return `${admin.firstName?.charAt(0) || ''}${admin.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (isEditing && selectedAdmin) {
    return <EditAdmin admin={selectedAdmin} onClose={closeEditModal} onSave={handleSaveEdit} />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className={`mb-8 rounded-3xl p-8 transition-colors duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={cardShadow}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
              👥 Admin Management
            </h1>
            <p className={`text-[11px] mt-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Manage your team administrators and their permissions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#800000] text-white'
                  : isdarkmode 
                    ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-[#800000] text-white'
                  : isdarkmode 
                    ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-6 rounded-3xl p-6 transition-colors duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={cardShadow}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Filter */}
          <div>
            <label className={`block text-[9px] uppercase tracking-widest mb-2 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-[11px] transition-colors ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] text-gray-200 border-white/10' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              } border outline-none`}
            >
              <option value="All">All Departments</option>
              {departmentList.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className={`block text-[9px] uppercase tracking-widest mb-2 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-[11px] transition-colors ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] text-gray-200 border-white/10' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              } border outline-none`}
            >
              <option value="All">All Roles</option>
              {roleList.map((role) => (
                <option key={role.id} value={role.id.toString()}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Admin Cards */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 rounded-2xl ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <p className="text-red-500 text-[11px] mb-4">{error}</p>
            <button
              onClick={loadAdmins}
              className="px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[11px] bold-text"
            >
              Retry
            </button>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              No administrators found
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCards.map((admin) => (
                  <div
                    key={admin._id}
                    className={`rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      isdarkmode ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-white hover:shadow-xl'
                    }`}
                    style={cardShadow}
                    onClick={() => handleView(admin)}
                  >
                    {/* Admin Avatar */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-[#800000] rounded-2xl flex items-center justify-center text-white text-xl bold-text uppercase shadow-lg overflow-hidden">
                        {admin.profilePicture ? (
                          <img src={admin.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          getUserInitials(admin)
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xs bold-text ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                          {admin.firstName} {admin.lastName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] bold-text inline-block mt-1 ${getRoleStyles(admin.role)}`}>
                          {roles[admin.role]}
                        </span>
                      </div>
                    </div>

                    {/* Admin Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getDepartmentIcon(admin.department)}</span>
                        <span className={`text-[11px] ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {departments[admin.department]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {admin.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {admin.contactNumber}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-opacity-10" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(admin);
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-[10px] bold-text transition-colors ${
                          isdarkmode 
                            ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(admin._id);
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-[10px] bold-text transition-colors ${
                          isdarkmode 
                            ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-3xl overflow-hidden ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={cardShadow}>
                <table className="w-full">
                  <thead className={`${isdarkmode ? 'bg-[#252525]' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Administrator
                      </th>
                      <th className={`px-6 py-4 text-left text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Department
                      </th>
                      <th className={`px-6 py-4 text-left text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Role
                      </th>
                      <th className={`px-6 py-4 text-left text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Contact
                      </th>
                      <th className={`px-6 py-4 text-left text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-opacity-10">
                    {currentCards.map((admin) => (
                      <tr
                        key={admin._id}
                        className={`transition-colors cursor-pointer ${
                          isdarkmode ? 'hover:bg-[#252525]' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleView(admin)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-[10px] bold-text uppercase overflow-hidden">
                              {admin.profilePicture ? (
                                <img src={admin.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                getUserInitials(admin)
                              )}
                            </div>
                            <div>
                              <p className={`text-xs bold-text ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {admin.firstName} {admin.lastName}
                              </p>
                              <p className={`text-[10px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {admin.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getDepartmentIcon(admin.department)}</span>
                            <span className={`text-[11px] ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {departments[admin.department]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] bold-text ${getRoleStyles(admin.role)}`}>
                            {roles[admin.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {admin.contactNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(admin);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] bold-text transition-colors ${
                                isdarkmode 
                                  ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(admin._id);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] bold-text transition-colors ${
                                isdarkmode 
                                  ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors text-[10px] bold-text ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors text-[10px] bold-text ${
                      currentPage === index + 1
                        ? 'bg-[#800000] text-white'
                        : isdarkmode 
                          ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors text-[10px] bold-text ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl transition-colors duration-500`}>
            <div className="text-center mb-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Confirm Deletion</h3>
              <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to delete this administrator? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors text-[11px] bold-text ${
                  isdarkmode 
                    ? 'bg-[#2a2a2a] text-gray-200 hover:bg-[#353535]' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(adminToDelete)}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors text-[11px] bold-text ${
                  isdarkmode 
                    ? 'bg-red-700 text-white hover:bg-red-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin View Modal */}
      {viewingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl max-w-2xl w-full shadow-2xl my-8 transition-colors duration-500`}>
            <div className={`sticky top-0 ${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border-b px-6 py-4 rounded-t-2xl flex items-center justify-between z-10`}>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] bold-text ${getRoleStyles(viewingAdmin.role)}`}>
                  {roles[viewingAdmin.role]}
                </span>
              </div>
              <button
                onClick={closeViewModal}
                className={`p-1.5 rounded-full transition-colors ${
                  isdarkmode ? 'hover:bg-[#2a2a2a] text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-[#800000] rounded-2xl flex items-center justify-center text-white text-2xl bold-text uppercase shadow-lg overflow-hidden">
                  {viewingAdmin.profilePicture ? (
                    <img src={viewingAdmin.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getUserInitials(viewingAdmin)
                  )}
                </div>
                <div>
                  <h2 className={`text-2xl bold-text ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                    {viewingAdmin.firstName} {viewingAdmin.lastName}
                  </h2>
                  <p className={`text-[11px] mt-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {departments[viewingAdmin.department]}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Email Address
                  </label>
                  <p className={`mt-1 text-xs ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {viewingAdmin.email}
                  </p>
                </div>

                <div>
                  <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Contact Number
                  </label>
                  <p className={`mt-1 text-xs ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {viewingAdmin.contactNumber}
                  </p>
                </div>

                <div>
                  <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Created Date
                  </label>
                  <p className={`mt-1 text-xs ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {formatDate(viewingAdmin.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`sticky bottom-0 ${isdarkmode ? 'bg-[#252525] border-white/10' : 'bg-gray-50 border-gray-200'} border-t px-6 py-3 rounded-b-2xl flex justify-end gap-2`}>
              <button
                onClick={closeViewModal}
                className={`px-4 py-2 border-2 rounded-lg transition-colors text-[10px] bold-text ${
                  isdarkmode 
                    ? 'bg-transparent border-white/10 text-gray-300 hover:bg-[#2a2a2a]' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeViewModal();
                  handleEdit(viewingAdmin);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#800000] to-[#600000] text-white rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-[10px] bold-text shadow-md"
              >
                Edit Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}