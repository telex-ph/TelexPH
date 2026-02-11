import React, { useRef, useEffect } from 'react';
import { useDarkMode } from '../../layout';
import { CaseStudyFormData } from './types';
import { AVAILABLE_CATEGORIES, STATUS_OPTIONS } from './constants';
import { getCurrentDate } from './helpers';

interface FormSectionProps {
  formData: CaseStudyFormData;
  isEditMode: boolean;
  timeError: string | null;
  showCategoryDropdown: boolean;
  fileRef: React.RefObject<HTMLInputElement>;
  onFormChange: (field: keyof CaseStudyFormData, value: any) => void;
  onCategoryToggle: (category: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onReset: () => void;
  onCategoryDropdownToggle: (show: boolean) => void;
  onScheduleDateChange: (date: string) => void;
  onScheduleTimeChange: (time: string) => void;
  isLoading: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  formData,
  isEditMode,
  timeError,
  showCategoryDropdown,
  fileRef,
  onFormChange,
  onCategoryToggle,
  onFileChange,
  onSubmit,
  onReset,
  onCategoryDropdownToggle,
  onScheduleDateChange,
  onScheduleTimeChange,
  isLoading,
}) => {
  const { isdarkmode } = useDarkMode();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle paste event for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob && fileRef.current) {
            // Create a synthetic event
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(blob);
            
            // Create a FileList
            const fileList = dataTransfer.files;
            
            // Create a mock event
            const mockEvent = {
              target: {
                files: fileList
              }
            } as any;
            
            onFileChange(mockEvent);
            e.preventDefault();
          }
        }
      }
    };

    const container = imageContainerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste as any);
    }

    return () => {
      if (container) {
        container.removeEventListener('paste', handlePaste as any);
      }
    };
  }, [onFileChange, fileRef]);

  // Handle click on image container
  const handleImageContainerClick = () => {
    if (formData.selectedimage) {
      // If image already exists, don't trigger file input
      return;
    }
    fileRef.current?.click();
  };

  return (
    <div className={`p-10 rounded-[2.5rem] shadow-sm border ${isdarkmode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h4 className={`text-base font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
            {isEditMode ? 'Edit Case Study' : 'New Case Study'}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            {isEditMode ? 'Update existing record' : 'Manage research database details'}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-medium ${
          isEditMode 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {formData.status}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-4 mb-6">
        <div>
          <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Title * <span className="text-gray-400">(0/30)</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Analysis Title"
            maxLength={30}
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => onFormChange('subtitle', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Subtitle"
          />
        </div>
      </div>

      {/* Author, Category, Status Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Author *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => onFormChange('author', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Category *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => onCategoryDropdownToggle(!showCategoryDropdown)}
              className={`w-full px-4 py-3 rounded-xl text-sm border text-left flex items-center justify-between ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2 flex-wrap">
                {formData.categories.length > 0 ? (
                  formData.categories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-900 text-white text-xs rounded-full font-medium">
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Select category</span>
                )}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showCategoryDropdown && (
              <div className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg border ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] border-[#3a3a3a]' 
                  : 'bg-white border-gray-200'
              }`}>
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      onCategoryToggle(cat);
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-between text-sm ${
                      isdarkmode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <span>{cat}</span>
                    {formData.categories.includes(cat) && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => onFormChange('status', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Date & Time (Only show if status is Scheduled) */}
      {formData.status === 'Scheduled' && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Schedule Date *
              </label>
              <input
                type="date"
                value={formData.scheduledate}
                onChange={(e) => onScheduleDateChange(e.target.value)}
                min={getCurrentDate()}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                  isdarkmode 
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Schedule Time *
              </label>
              <input
                type="time"
                value={formData.scheduletime}
                onChange={(e) => onScheduleTimeChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                  isdarkmode 
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>
          {timeError && (
            <p className="text-xs text-red-500 mt-2">{timeError}</p>
          )}
        </div>
      )}

      {/* Image Upload Section - Entire container clickable and pasteable */}
      <div className="mb-6">
        <label className={`block text-xs font-medium mb-3 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
          Cover Image *
        </label>
        <div
          ref={imageContainerRef}
          onClick={handleImageContainerClick}
          tabIndex={0}
          className={`relative p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isdarkmode 
              ? 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-red-900/50 hover:bg-[#303030]' 
              : 'bg-gray-50 border-gray-200 hover:border-red-900/50 hover:bg-gray-100'
          }`}
        >
          {formData.selectedimage ? (
            <div className="relative">
              <img 
                src={formData.selectedimage} 
                className="w-full h-64 object-cover rounded-xl mb-4" 
                alt="Preview"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFormChange('selectedimage', null);
                  onFormChange('selectedfile', null);
                  if (fileRef.current) {
                    fileRef.current.value = '';
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-900">CHOOSE IMAGE FILE</span>
              <p className="text-xs text-gray-400 mt-2">.PNG, .JPG, .WEBP</p>
              <p className="text-xs text-gray-400 mt-1">Click to browse or paste image (Ctrl+V / Cmd+V)</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              Timeline Start
            </label>
            <input
              type="date"
              value={formData.startdate}
              onChange={(e) => onFormChange('startdate', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              Timeline End
            </label>
            <input
              type="date"
              value={formData.enddate}
              onChange={(e) => onFormChange('enddate', e.target.value)}
              disabled={formData.isunfinished}
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } disabled:opacity-50`}
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isunfinished}
              onChange={(e) => onFormChange('isunfinished', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900"
            />
            <span className={`text-xs font-medium ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              Project Unfinished
            </span>
          </label>
        </div>
      </div>

      {/* Content Framework */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h5 className={`text-sm font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
            Content Framework
          </h5>
          <span className="text-xs text-gray-400">All 5 Sections Required</span>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className={`p-5 rounded-2xl border ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a]' 
                : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {String(num).padStart(2, '0')}
                </div>
                <input
                  type="text"
                  value={formData[`topic${num}` as keyof CaseStudyFormData] as string}
                  onChange={(e) => onFormChange(`topic${num}` as keyof CaseStudyFormData, e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                    isdarkmode 
                      ? 'bg-[#1e1e1e] text-white placeholder-gray-500' 
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Topic Header"
                />
              </div>
              <textarea
                value={formData[`content${num}` as keyof CaseStudyFormData] as string}
                onChange={(e) => onFormChange(`content${num}` as keyof CaseStudyFormData, e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                  isdarkmode 
                    ? 'bg-[#1e1e1e] text-white placeholder-gray-500' 
                    : 'bg-white text-gray-900 placeholder-gray-400'
                }`}
                placeholder="Provide detailed analytical content here..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Key Challenge & Final Solution */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-red-500 rounded-full"></div>
            <h5 className={`text-sm font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
              Key Challenge
            </h5>
          </div>
          <textarea
            value={formData.challenge}
            onChange={(e) => onFormChange('challenge', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="What was the main obstacle?"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-green-500 rounded-full"></div>
            <h5 className={`text-sm font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
              Final Solution
            </h5>
          </div>
          <textarea
            value={formData.solution}
            onChange={(e) => onFormChange('solution', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              isdarkmode 
                ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="How was it resolved?"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
        {isEditMode && (
          <button
            onClick={onReset}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
              isdarkmode
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Discard Changes
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-red-900 text-white rounded-xl text-sm font-semibold hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Publish Study'}
        </button>
      </div>
    </div>
  );
};