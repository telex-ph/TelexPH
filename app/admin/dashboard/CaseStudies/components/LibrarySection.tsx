import React from 'react';
import { useDarkMode } from '../../layout';
import { CaseStudy } from './types';
import { AVAILABLE_CATEGORIES, STATUS_TAB_OPTIONS, SORT_OPTIONS } from './constants';
import { getstatusbadgecolor, getcategorybadgecolor } from './helpers';
import { CaseStudyCard } from './CaseStudyCard';

interface LibrarySectionProps {
  records: CaseStudy[];
  filteredRecords: CaseStudy[];
  activeTab: string;
  searchQuery: string;
  sortBy: string;
  filteredCategories: string[];
  editingId: string | null;
  onTabChange: (tab: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryFilter: (category: string) => void;
  onPreview: (study: CaseStudy) => void;
  onEdit: (study: CaseStudy) => void;
  onDelete: (study: CaseStudy) => void;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  records,
  filteredRecords,
  activeTab,
  searchQuery,
  sortBy,
  filteredCategories,
  editingId,
  onTabChange,
  onSearchChange,
  onSortChange,
  onCategoryFilter,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const { isdarkmode } = useDarkMode();

  return (
    <div className="w-full pb-20">
      <div className="mb-6">
        <h4 className={`text-base font-semibold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
          Case Study Library
        </h4>
        <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
          All registered analysis and records
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <h5 className={`text-xs font-semibold mb-3 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
          Status
        </h5>
        <div className="flex flex-wrap gap-2">
          {STATUS_TAB_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => onTabChange(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === status
                  ? status === 'All' 
                    ? 'bg-gray-800 text-white shadow-md'
                    : status === 'Active'
                    ? 'bg-[#10B981] text-white shadow-md'
                    : status === 'Completed'
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : status === 'Draft'
                    ? 'bg-[#9CA3AF] text-white shadow-md'
                    : 'bg-[#F59E0B] text-white shadow-md'
                  : `${isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333333]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
              }`}
            >
              {status} ({status === 'All' ? records.length : records.filter(r => r.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h5 className={`text-xs font-semibold mb-3 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
          Category
        </h5>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CATEGORIES.map((category) => {
            const isSelected = filteredCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => onCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? category === 'Technology'
                      ? 'bg-[#0EA5E9] text-white shadow-md'
                      : category === 'Logistics'
                      ? 'bg-[#FF6B4A] text-white shadow-md'
                      : category === 'Analytics'
                      ? 'bg-[#A855F7] text-white shadow-md'
                      : 'bg-[#06B6D4] text-white shadow-md'
                    : `${isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333333]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                }`}
              >
                {category}
                {isSelected && <span className="ml-1.5">×</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className={`p-8 rounded-[2.5rem] shadow-sm border ${
        isdarkmode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100'
      }`}>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-20">
            <svg className={`mx-auto h-16 w-16 mb-4 ${isdarkmode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className={`text-sm font-medium ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              No records found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredRecords.map((rec) => (
              <CaseStudyCard
                key={rec.id}
                study={rec}
                isEditing={editingId === rec.id}
                onPreview={() => onPreview(rec)}
                onEdit={() => onEdit(rec)}
                onDelete={() => onDelete(rec)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};