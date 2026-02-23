'use client'

import React, { useRef } from 'react'
import { useDarkMode } from '../../layout'
import { useCaseStudies } from './useCaseStudies'
import { FormSection } from './FormSection'
import { LibrarySection } from './LibrarySection'
import { ConfirmModal } from './ConfirmModal'
import { DeleteModal } from './DeleteModal'
import { PreviewModal } from './PreviewModal'
import { CalendarModal } from './CalendarModal'
import { DateModal } from './DateModal'
import { MONTHS } from './constants'
import { getCalendarDays } from './helpers'

export default function CaseStudies() {
  const { isdarkmode } = useDarkMode();
  const formRef = useRef<HTMLDivElement>(null);

  const {
    // States
    formData,
    modalState,
    filterState,
    editState,
    loadingState,
    messageState,
    records,
    filteredrecords,
    previewdata,
    deletetarget,
    selecteddatedata,
    showCategoryDropdown,
    selectedmonthindex,
    fileref,
    
    // Functions
    updateFormField,
    updateModalState,
    updateFilterState,
    togglecategory,
    toggleCategoryFilter,
    resetform,
    validateform,
    handlesubmit,
    handleedit,
    handledeleteclick,
    handledeleteconfirm,
    handlepreview,
    handledayclick,
    handlefilechange,
    handleScheduleTimeChange,
    handleScheduleDateChange,
    setShowCategoryDropdown,
    setselectedmonthindex,
  } = useCaseStudies();

  // Get current month's calendar days for mini calendar
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();
  const miniCalendarDays = getCalendarDays(currentMonth);

  // Wrap handleedit to also scroll to form
  const handleEditWithScroll = (study: Parameters<typeof handleedit>[0]) => {
    handleedit(study);
    // Use setTimeout to allow state update before scrolling
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div 
      className={`flex flex-col items-start justify-start p-6 space-y-6 min-h-screen transition-colors duration-300 ${
        isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'
      }`} 
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif !important; }
        
        /* Hide scrollbars globally but keep functionality */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        
        /* Hide all scrollbars by default */
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Error and Success Messages */}
      {messageState.error && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-xl z-50 text-sm font-medium animate-slide-in">
          {messageState.error}
        </div>
      )}
      {messageState.success && (
        <div className="fixed top-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl z-50 text-sm font-medium animate-slide-in">
          {messageState.success}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={modalState.showconfirmmodal}
        isEditMode={editState.isEditMode}
        isLoading={loadingState.isloading}
        onClose={() => updateModalState('showconfirmmodal', false)}
        onConfirm={handlesubmit}
      />

      <DeleteModal
        isOpen={modalState.showdeletemodal}
        isDeleting={loadingState.isdeleting}
        targetTitle={deletetarget?.title}
        onClose={() => updateModalState('showdeletemodal', false)}
        onConfirm={handledeleteconfirm}
      />

      <PreviewModal
        isOpen={modalState.showpreviewmodal}
        data={previewdata}
        onClose={() => updateModalState('showpreviewmodal', false)}
        onEdit={handleEditWithScroll}
      />

      <CalendarModal
        isOpen={modalState.showcalendarmodal}
        selectedMonthIndex={selectedmonthindex}
        records={records}
        onClose={() => updateModalState('showcalendarmodal', false)}
        onMonthChange={setselectedmonthindex}
        onDateClick={handledayclick}
      />

      <DateModal
        isOpen={modalState.showdatemodal}
        dateData={selecteddatedata}
        onClose={() => updateModalState('showdatemodal', false)}
        onSelectStudy={handlepreview}
      />

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className={`text-2xl font-semibold ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
            Case Study
          </h2>
          <p className={`text-xs italic ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage Your Case Studies: Create, Edit, and Organize Your Research Projects with Ease
          </p>
        </div>

        {/* Top Section: Form + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Section - Left Column */}
          <div className="lg:col-span-8">
            <FormSection
              formData={formData}
              isEditMode={editState.isEditMode}
              timeError={messageState.timeError}
              showCategoryDropdown={showCategoryDropdown}
              fileRef={fileref}
              formRef={formRef}
              onFormChange={updateFormField}
              onCategoryToggle={togglecategory}
              onFileChange={handlefilechange}
              onSubmit={validateform}
              onReset={resetform}
              onCategoryDropdownToggle={setShowCategoryDropdown}
              onScheduleDateChange={handleScheduleDateChange}
              onScheduleTimeChange={handleScheduleTimeChange}
              isLoading={loadingState.isloading}
            />
          </div>

          {/* Quick Stats - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Card */}
            <div className={`p-8 rounded-[2.5rem] shadow-sm border transition-all ${
              isdarkmode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className={`text-base font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                    Quick Stats
                  </h4>
                  <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current system overview and counts
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Active */}
                <div className={`p-4 rounded-2xl text-center ${
                  isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Active
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-3xl font-bold text-red-900">
                      {records.filter(r => r.status === 'Active').length}
                    </div>
                    <div className="p-2 bg-red-900 text-white rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Completed */}
                <div className={`p-4 rounded-2xl text-center ${
                  isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Done
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-3xl font-bold text-green-600">
                      {records.filter(r => r.status === 'Completed').length}
                    </div>
                    <div className="p-2 bg-green-600 text-white rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Draft */}
                <div className={`p-4 rounded-2xl text-center ${
                  isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Draft
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-3xl font-bold text-gray-600">
                      {records.filter(r => r.status === 'Draft').length}
                    </div>
                    <div className="p-2 bg-gray-600 text-white rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Scheduled */}
                <div className={`p-4 rounded-2xl text-center ${
                  isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Schedule
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-3xl font-bold text-purple-600">
                      {records.filter(r => r.status === 'Scheduled').length}
                    </div>
                    <div className="p-2 bg-purple-600 text-white rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <div className={`text-xs font-medium mb-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total
                </div>
                <div className={`text-5xl font-bold ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                  {records.length}
                </div>
              </div>
            </div>

            {/* Timeline & Events Card with Mini Calendar */}
            <div className={`p-8 rounded-[2.5rem] shadow-sm border transition-all ${
              isdarkmode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className={`text-base font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                    Timeline & Events
                  </h4>
                  <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Scheduled activities and research milestones
                  </p>
                </div>
                <button
                  onClick={() => updateModalState('showcalendarmodal', true)}
                  className={`p-2 rounded-xl transition-all ${
                    isdarkmode 
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10H3M16 2v4M8 2v4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                  </svg>
                </button>
              </div>

              {/* Mini Calendar Display */}
              <div className={`p-4 rounded-2xl ${isdarkmode ? 'bg-[#2a2a2a]' : 'bg-gray-50'}`}>
                {/* Month and Year */}
                <div className={`text-center mb-4 font-semibold text-sm ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                  {MONTHS[currentMonth]} {currentYear}
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className={`text-center text-[9px] font-bold ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {miniCalendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={idx} className="aspect-square" />;
                    }

                    const isToday = day === currentDay;
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasEvents = records.some(r => r.start === dateStr);

                    return (
                      <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all ${
                          isToday
                            ? 'bg-red-900 text-white font-bold'
                            : hasEvents
                            ? isdarkmode 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                            : isdarkmode
                            ? 'text-gray-400 hover:bg-white/5'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          updateModalState('showcalendarmodal', true);
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-900"></div>
                    <span className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${isdarkmode ? 'bg-white/10' : 'bg-blue-100'}`}></div>
                    <span className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>Has Events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Library Section */}
        <LibrarySection
          records={records}
          filteredRecords={filteredrecords}
          activeTab={filterState.activetab}
          searchQuery={filterState.searchquery}
          sortBy={filterState.sortby}
          filteredCategories={filterState.filteredcategories}
          editingId={editState.editingId}
          onTabChange={(tab) => updateFilterState('activetab', tab)}
          onSearchChange={(query) => updateFilterState('searchquery', query)}
          onSortChange={(sort) => updateFilterState('sortby', sort)}
          onCategoryFilter={toggleCategoryFilter}
          onPreview={handlepreview}
          onEdit={handleEditWithScroll}
          onDelete={handledeleteclick}
        />
      </div>
    </div>
  );
}