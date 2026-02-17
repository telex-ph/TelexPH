import React from 'react';
import { useDarkMode } from '../../layout';
import { CaseStudy } from './types';
import { MONTHS, DAYS_SHORT } from './constants';
import { getCalendarDays } from './helpers';

interface CalendarData {
  day: number;
  currentmonth: boolean;
  istoday: boolean;
  markedDates?: { color: string }[];
}

interface CalendarModalProps {
  isOpen: boolean;
  selectedMonthIndex: number;
  records: CaseStudy[];
  onClose: () => void;
  onMonthChange: (index: number) => void;
  onDateClick: (day: number) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  selectedMonthIndex,
  records,
  onClose,
  onMonthChange,
  onDateClick,
}) => {
  const { isdarkmode } = useDarkMode();

  if (!isOpen) return null;

  const days = getCalendarDays(selectedMonthIndex);
  const today = new Date();
  
  const calendardata: CalendarData[] = days.map(d => {
    if (d === null) return { day: 0, currentmonth: false, istoday: false };
    
    const year = today.getFullYear();
    const dateStr = `${year}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const studiesOnDate = records.filter(r => r.start === dateStr);
    
    const markedDates = studiesOnDate.map(study => {
      switch (study.status) {
        case 'Active': return { color: 'bg-[#10B981]' };
        case 'Completed': return { color: 'bg-[#3B82F6]' };
        case 'Draft': return { color: 'bg-[#9CA3AF]' };
        case 'Scheduled': return { color: 'bg-[#F59E0B]' };
        default: return { color: 'bg-gray-400' };
      }
    });

    return {
      day: d,
      currentmonth: true,
      istoday: d === today.getDate() && selectedMonthIndex === today.getMonth(),
      markedDates: markedDates.length > 0 ? markedDates : undefined
    };
  });

  const handleDateClick = (d: CalendarData) => {
    if (d.currentmonth && d.day > 0) {
      onDateClick(d.day);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8 no-scrollbar">
      <div className={`rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl ${
        isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {/* Left Side: Calendar */}
          <div className={`flex-[3] p-8 overflow-y-auto no-scrollbar ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="mb-6">
              <h3 className={`text-xl font-semibold ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                Calendar
              </h3>
              <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                Select a date to view details
              </p>
            </div>

            {/* Month Selector */}
            <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-2xl ${
              isdarkmode ? 'bg-[#242424]' : 'bg-gray-50'
            }`}>
              {MONTHS.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => onMonthChange(idx)}
                  className={`flex-1 min-w-[60px] text-center py-2.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-all duration-200 ${
                    idx === selectedMonthIndex 
                      ? 'bg-red-900 text-white shadow-lg' 
                      : isdarkmode
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {m.substring(0, 3)}
                </button>
              ))}
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-3 text-center mb-3">
              {DAYS_SHORT.map(day => (
                <span key={day} className={`text-[10px] font-bold uppercase ${
                  isdarkmode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2.5">
              {calendardata.map((d, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl transition-all duration-200 flex items-center justify-center cursor-pointer min-h-[56px] ${
                    d.currentmonth 
                      ? isdarkmode 
                        ? 'bg-[#242424] hover:bg-[#2a2a2a] border border-[#2e2e2e]' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                      : 'bg-transparent opacity-30'
                  }`}
                  onClick={() => handleDateClick(d)}
                >
                  {/* Date markers */}
                  <div className="absolute top-1.5 right-1.5 flex -space-x-1">
                    {d.markedDates && d.markedDates.length > 0 && d.markedDates.map((mark, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${mark.color}`}
                      />
                    ))}
                  </div>
                  
                  {/* Day number */}
                  <span
                    className={`text-sm font-medium transition-all ${
                      d.istoday
                        ? 'text-white bg-red-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-lg'
                        : d.currentmonth
                        ? isdarkmode ? 'text-gray-200' : 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {d.day || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Details Panel */}
          <div className={`flex-[2] p-8 flex flex-col relative overflow-y-auto no-scrollbar ${
            isdarkmode ? 'bg-[#222222]' : 'bg-gray-50'
          }`}>
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2.5 rounded-full transition-all ${
                isdarkmode 
                  ? 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333333]' 
                  : 'bg-white text-gray-600 hover:text-gray-900 shadow-sm'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="mt-12 mb-6">
              <h3 className={`text-lg font-semibold ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                Event Details
              </h3>
              <p className={`text-xs mt-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                Stay updated with our project timeline and milestone completions.
              </p>
            </div>

            <div className="space-y-6">
              <div className={`p-5 rounded-2xl ${
                isdarkmode ? 'bg-red-900/10 border border-red-900/20' : 'bg-red-50 border border-red-100'
              }`}>
                <p className={`text-[10px] font-bold uppercase mb-1.5 ${
                  isdarkmode ? 'text-red-400' : 'text-red-700'
                }`}>
                  Tip
                </p>
                <p className={`text-xs leading-relaxed ${
                  isdarkmode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Click on any highlighted date to view associated case studies or project updates.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                  <span className={`text-xs font-medium ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></div>
                  <span className={`text-xs font-medium ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></div>
                  <span className={`text-xs font-medium ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Draft
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                  <span className={`text-xs font-medium ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};