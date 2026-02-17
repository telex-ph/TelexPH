'use client'

import React, { useState, useRef } from 'react'
import { useDarkMode } from '../../layout'

export default function AddAdmin() { 
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [department, setDepartment] = useState<number | ''>('');
  const [role, setRole] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      role !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword
    );
  };

  const handleFinalConfirm = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowConfirmModal(false);
      setShowErrorModal(true);
      return;
    }

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
        password: password,
      };
      
      // Only include profilePicture if an image was selected
      if (selectedImage) {
        payload.profilePicture = selectedImage;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create admin');
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setContactNumber('');
      setDepartment('');
      setRole('');
      setPassword('');
      setConfirmPassword('');
      setSelectedImage(null);
      actualFileRef.current = null;
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      setErrorMessage(error.message || 'Failed to create admin. Please try again.');
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
            <h1 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
              ➕ Add New Administrator
            </h1>
            <p className={`text-[11px] mt-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Create a new administrator account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className={`border-2 border-dashed rounded-3xl p-6 transition-colors ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className={`block text-[9px] uppercase tracking-widest mb-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Profile Picture (Optional)
              </label>
              
              <input 
                ref={fileRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-full aspect-square object-cover rounded-2xl mb-4"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      actualFileRef.current = null;
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                    className={`w-full py-3 rounded-xl text-[10px] bold-text transition-colors ${
                      isdarkmode 
                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Remove Image
                  </button>
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
                  <p className={`text-[11px] bold-text mb-1 ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Click to upload
                  </p>
                  <p className={`text-[10px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                    PNG, JPG or JPEG
                  </p>
                </div>
              )}
              
              {isCompressing && (
                <div className="text-center mt-4">
                  <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>PERSONAL INFORMATION</label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>First Name *</label>
                  <input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    type="text" 
                    placeholder="Enter first name..." 
                    className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                      isdarkmode 
                        ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                        : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Last Name *</label>
                  <input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    type="text" 
                    placeholder="Enter last name..." 
                    className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                      isdarkmode 
                        ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                        : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Email Address *</label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Enter email address..." 
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Contact Number *</label>
                <input 
                  value={contactNumber} 
                  onChange={(e) => setContactNumber(e.target.value)} 
                  type="text" 
                  placeholder="Enter contact number..." 
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
              </div>
            </div>

            {/* Role & Department */}
            <div className={`border rounded-3xl p-6 space-y-4 ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>ROLE & DEPARTMENT</label>
              </div>
              
              <div>
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(parseInt(e.target.value))}
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 border-gray-200 focus:border-[#800000]'
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
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 border-gray-200 focus:border-[#800000]'
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

            {/* Password */}
            <div className={`border rounded-3xl p-6 space-y-4 ${isdarkmode ? 'border-white/10 bg-[#252525]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                <label className={`text-[9px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>SECURITY</label>
              </div>
              
              <div>
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Password *</label>
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type="password" 
                  placeholder="Enter password..." 
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[9px] mb-2 block uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Confirm Password *</label>
                <input 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  type="password" 
                  placeholder="Confirm password..." 
                  className={`w-full p-3 text-[11px] outline-none rounded-xl border transition-colors ${
                    isdarkmode 
                      ? 'bg-[#1a1a1a] text-gray-200 placeholder-gray-600 border-white/10 focus:border-[#800000]' 
                      : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#800000]'
                  }`}
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className={`flex justify-between items-center pt-6 mt-4 border-t ${isdarkmode ? 'border-white/10' : 'border-gray-50'}`}>
              <p className={`text-[10px] italic ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Review Your Entry Before Finalizing.
              </p>
              <button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={!isFormValid() || isSubmitting}
                className={`px-10 py-3 text-[11px] bold-text rounded-xl transition-all ${
                  isFormValid() && !isSubmitting 
                    ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/30 hover:bg-[#600000]' 
                    : isdarkmode 
                      ? 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Administrator'}
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
              <div className="text-6xl mb-4">👤</div>
              <h3 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                Confirm Creation
              </h3>
              <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you ready to create this administrator account?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors text-[11px] bold-text ${
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
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[11px] bold-text disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Confirm'}
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
              <h3 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                Success!
              </h3>
              <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Administrator account has been created successfully.
              </p>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[11px] bold-text"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">❌</div>
              <h3 className={`text-2xl bold-text mb-2 ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                Error
              </h3>
              <p className={`text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
            
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-[11px] bold-text"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}