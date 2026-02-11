'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDarkMode } from '../../layout'

interface EditAdminProps {
  admin: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EditAdmin({ admin, onClose, onSave }: EditAdminProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const actualFileRef = useRef<File | null>(null);
  
  const { isdarkmode } = useDarkMode();
  
  // Form state
  const [firstName, setFirstName] = useState(admin.firstName || '');
  const [lastName, setLastName] = useState(admin.lastName || '');
  const [email, setEmail] = useState(admin.email || '');
  const [contactNumber, setContactNumber] = useState(admin.contactNumber || '');
  const [department, setDepartment] = useState<number>(admin.department || '');
  const [role, setRole] = useState<number>(admin.role || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(admin.profilePicture || null);
  const [removeImage, setRemoveImage] = useState(false);

  // Department and Role mappings
  const departments = [
    { id: 1, name: 'Compliance', icon: '⚖️' },
    { id: 2, name: 'Innovation', icon: '💡' },
    { id: 3, name: 'Marketing', icon: '📢' },
    { id: 4, name: 'Recruitment', icon: '👥' },
    { id: 5, name: 'Human Resources', icon: '🤝' }
  ];

  const roles = [
    { id: 1, name: 'Main Administrator' },
    { id: 2, name: 'Administrator' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      actualFileRef.current = file;
      setRemoveImage(false);
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxWidth = 800; 
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setSelectedImage(canvas.toDataURL('image/jpeg', 0.7));
            setIsCompressing(false);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBrowse = () => fileRef.current?.click();

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      contactNumber.trim() !== '' &&
      department !== '' &&
      role !== ''
    );
  };

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);

    try {
      // Build JSON payload
      const payload: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        department: Number(department),
        role: Number(role),
      };
      
      // Handle profile picture
      if (selectedImage && selectedImage !== admin.profilePicture) {
        // New image was selected
        payload.profilePicture = selectedImage;
      } else if (removeImage) {
        // Remove existing image
        payload.profilePicture = '';
      }
      // If neither condition is true, don't include profilePicture (keep existing)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/users/${admin._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update admin');
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        onSave();
      }, 1500);
    } catch (error: any) {
      console.error('Error updating admin:', error);
      setErrorMessage(error.message || 'Failed to update admin. Please try again.');
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`mb-8 rounded-3xl p-8 transition-colors duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.03)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
              ✏️ Edit Administrator
            </h1>
            <p className={`text-sm ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              Update administrator information
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isdarkmode 
                ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className={`border-2 border-dashed rounded-3xl p-6 transition-colors ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className={`block text-xs font-semibold mb-4 uppercase tracking-wider ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Profile Picture
              </label>
              
              <input 
                ref={fileRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedImage && !removeImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-full aspect-square object-cover rounded-2xl mb-4"
                  />
                  <div className="space-y-2">
                    <button
                      onClick={triggerBrowse}
                      className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                        isdarkmode 
                          ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Change Image
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setRemoveImage(true);
                        actualFileRef.current = null;
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                        isdarkmode 
                          ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={triggerBrowse}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isdarkmode 
                      ? 'border-white/10 hover:border-[#800000] hover:bg-[#800000]/5' 
                      : 'border-gray-200 hover:border-[#800000] hover:bg-[#800000]/5'
                  }`}
                >
                  <div className="text-4xl mb-3">📸</div>
                  <p className={`text-sm font-medium mb-1 ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Click to upload
                  </p>
                  <p className={`text-xs ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    PNG, JPG or JPEG
                  </p>
                </div>
              )}
              
              {isCompressing && (
                <div className="text-center mt-4">
                  <p className={`text-xs ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Compressing image...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className={`border rounded-3xl p-6 space-y-4 ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                <label className={`text-xs tracking-widest font-semibold ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>PERSONAL INFORMATION</label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>First Name *</label>
                  <input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    type="text" 
                    placeholder="Enter first name..." 
                    className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                      isdarkmode 
                        ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                        : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Last Name *</label>
                  <input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    type="text" 
                    placeholder="Enter last name..." 
                    className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                      isdarkmode 
                        ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                        : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Email Address *</label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Enter email address..." 
                  className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Contact Number *</label>
                <input 
                  value={contactNumber} 
                  onChange={(e) => setContactNumber(e.target.value)} 
                  type="text" 
                  placeholder="Enter contact number..." 
                  className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
              </div>
            </div>

            {/* Role & Department */}
            <div className={`border rounded-3xl p-6 space-y-4 ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                <label className={`text-xs tracking-widest font-semibold ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>ROLE & DEPARTMENT</label>
              </div>
              
              <div>
                <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(parseInt(e.target.value))}
                  className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-900 border-gray-200 focus:border-[#800000]'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.icon} {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-xs mb-2 block tracking-wider font-medium ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                  className={`w-full p-3 text-sm outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-900 border-gray-200 focus:border-[#800000]'
                  }`}
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className={`flex justify-between items-center pt-6 mt-4 border-t ${isdarkmode ? 'border-white/10' : 'border-gray-50'}`}>
              <button
                onClick={onClose}
                className={`px-8 py-3 text-sm rounded-xl transition-all font-medium ${
                  isdarkmode 
                    ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={!isFormValid() || isSubmitting}
                className={`px-10 py-3 text-sm rounded-xl transition-all font-medium ${
                  isFormValid() && !isSubmitting 
                    ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/30 hover:bg-[#600000]' 
                    : isdarkmode 
                      ? 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update Administrator'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✏️</div>
              <h3 className={`text-2xl font-bold mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                Confirm Update
              </h3>
              <p className={`${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you ready to update this administrator's information?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                  isdarkmode 
                    ? 'bg-[#2a2a2a] text-gray-200 hover:bg-[#353535]' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className={`text-2xl font-bold mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                Success!
              </h3>
              <p className={`${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Administrator information has been updated successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">❌</div>
              <h3 className={`text-2xl font-bold mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                Error
              </h3>
              <p className={`${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
            
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}