import { useRef, useEffect } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { AVAILABLE_CATEGORIES, STATUS_OPTIONS } from "./constants";
import { getCurrentDate } from "./helpers";
const FormSection = ({
  formData,
  isEditMode,
  timeError,
  showCategoryDropdown,
  fileRef,
  formRef,
  onFormChange,
  onCategoryToggle,
  onFileChange,
  onSubmit,
  onReset,
  onCategoryDropdownToggle,
  onScheduleDateChange,
  onScheduleTimeChange,
  isLoading
}) => {
  const { isdarkmode } = useDarkMode();
  const imageContainerRef = useRef(null);
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob && fileRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(blob);
            const fileList = dataTransfer.files;
            const mockEvent = {
              target: {
                files: fileList
              }
            };
            onFileChange(mockEvent);
            e.preventDefault();
          }
        }
      }
    };
    const container = imageContainerRef.current;
    if (container) {
      container.addEventListener("paste", handlePaste);
    }
    return () => {
      if (container) {
        container.removeEventListener("paste", handlePaste);
      }
    };
  }, [onFileChange, fileRef]);
  const handleImageContainerClick = () => {
    if (formData.selectedimage) {
      return;
    }
    fileRef.current?.click();
  };
  return <div
    ref={formRef}
    className={`p-10 rounded-[2.5rem] shadow-sm border bg-[var(--admin-surface)] border-[var(--admin-border)]`}
  >
      {
    /* Header */
  }
      <div className="flex items-start justify-between mb-8">
        <div>
          <h4 className={`text-base font-semibold text-[var(--admin-text)]`}>
            {isEditMode ? "Edit Case Study" : "Create New Case Study"}
          </h4>
          <p className={`text-xs mt-1 text-[var(--admin-text-faint)]`}>
            {isEditMode ? "Update the details below" : "Fill in the details below"}
          </p>
        </div>
        {isEditMode && <span className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-full">
            Editing Mode
          </span>}
      </div>

      {
    /* Cover Image */
  }
      <div className="mb-6">
        <label className={`block text-xs font-semibold mb-3 text-[var(--admin-text-sub)]`}>
          Cover Image *
        </label>
        <div
    ref={imageContainerRef}
    onClick={handleImageContainerClick}
    className={`relative w-full h-64 rounded-[2rem] overflow-hidden cursor-pointer transition-all border-2 border-dashed ${formData.selectedimage ? "border-transparent" : "border-[var(--admin-border-strong)] hover:border-[var(--admin-border-strong)] bg-[var(--admin-bg-soft)]"}`}
    tabIndex={0}
  >
          {formData.selectedimage ? <>
              <img
    src={formData.selectedimage}
    alt="Preview"
    className="w-full h-full object-cover"
  />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      fileRef.current?.click();
    }}
    className="px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
  >
                  Change Image
                </button>
                <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onFormChange("selectedimage", null);
      onFormChange("selectedfile", null);
    }}
    className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
  >
                  Remove
                </button>
              </div>
            </> : <div className="flex flex-col items-center justify-center h-full">
              <svg className={`w-12 h-12 mb-3 text-[var(--admin-text-faint)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className={`text-sm font-medium mb-1 text-[var(--admin-text-sub)]`}>
                Click to upload or paste image
              </p>
              <p className={`text-xs text-[var(--admin-text-faint)]`}>
                PNG, JPG, JPEG, WebP up to 10MB
              </p>
            </div>}
        </div>
        <input
    ref={fileRef}
    type="file"
    accept="image/png,image/jpeg,image/webp"
    onChange={onFileChange}
    className="hidden"
  />
      </div>

      {
    /* Title & Subtitle */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Title *
          </label>
          <input
    type="text"
    value={formData.title}
    onChange={(e) => onFormChange("title", e.target.value)}
    placeholder="Enter case study title"
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Subtitle
          </label>
          <input
    type="text"
    value={formData.subtitle}
    onChange={(e) => onFormChange("subtitle", e.target.value)}
    placeholder="Enter subtitle (optional)"
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
      </div>

      {
    /* Author & Status */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Author *
          </label>
          <input
    type="text"
    value={formData.author}
    onChange={(e) => onFormChange("author", e.target.value)}
    placeholder="Enter author name"
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Status *
          </label>
          <select
    value={formData.status}
    onChange={(e) => onFormChange("status", e.target.value)}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  >
            {STATUS_OPTIONS.map((status) => {
    const isDisabled = formData.isunfinished && status !== "Draft";
    return <option
      key={status}
      value={status}
      disabled={isDisabled}
      style={isDisabled ? { color: "#9CA3AF" } : void 0}
    >
                  {status}{isDisabled ? " (requires end date)" : ""}
                </option>;
  })}
          </select>
          {formData.isunfinished && <p className={`text-xs mt-1.5 ${isdarkmode ? "text-amber-400" : "text-amber-600"}`}>
              Only <strong>Draft</strong> is available while the study is marked as Unfinished.
            </p>}
        </div>
      </div>

      {
    /* Schedule Date & Time (only if status is Scheduled) */
  }
      {formData.status === "Scheduled" && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
              Schedule Date *
            </label>
            <input
    type="date"
    value={formData.scheduledate}
    onChange={(e) => onScheduleDateChange(e.target.value)}
    min={getCurrentDate()}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
              Schedule Time *
            </label>
            <input
    type="time"
    value={formData.scheduletime}
    onChange={(e) => onScheduleTimeChange(e.target.value)}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
            {timeError && <p className="text-xs text-red-500 mt-2">{timeError}</p>}
          </div>
        </div>}

      {
    /* Categories */
  }
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-xs font-semibold text-[var(--admin-text-sub)]`}>
            Categories *
          </label>
          {formData.categories.length > 0 && <button
    type="button"
    onClick={() => onFormChange("categories", [])}
    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors text-[var(--admin-text-faint)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}
  >
              Clear
            </button>}
        </div>
        <div className="relative">
          <button
    type="button"
    onClick={() => onCategoryDropdownToggle(!showCategoryDropdown)}
    className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all outline-none flex items-center justify-between bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:border-[var(--admin-accent)]`}
  >
            <span>
              {formData.categories.length > 0 ? formData.categories.join(", ") : "Select categories"}
            </span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCategoryDropdown && <div className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg border bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              {AVAILABLE_CATEGORIES.map((category) => <button
    key={category}
    type="button"
    onClick={() => onCategoryToggle(category)}
    className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${formData.categories.includes(category) ? isdarkmode ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700" : "text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]"}`}
  >
                  <span>{category}</span>
                  {formData.categories.includes(category) && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>}
                </button>)}
            </div>}
        </div>
      </div>

      {
    /* Date Range */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Start Date *
          </label>
          <input
    type="date"
    value={formData.startdate}
    onChange={(e) => onFormChange("startdate", e.target.value)}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            End Date
          </label>
          <div className="flex gap-3 items-center">
            <input
    type="date"
    value={formData.enddate}
    onChange={(e) => onFormChange("enddate", e.target.value)}
    disabled={formData.isunfinished}
    min={formData.startdate || void 0}
    className={`flex-1 px-4 py-3 rounded-xl text-sm transition-all outline-none ${formData.isunfinished ? "bg-[var(--admin-bg-soft)] text-[var(--admin-text-faint)] cursor-not-allowed" : "bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]"}`}
  />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
    type="checkbox"
    checked={formData.isunfinished}
    onChange={(e) => onFormChange("isunfinished", e.target.checked)}
    className="w-4 h-4 rounded accent-red-900"
  />
              <span className={`text-xs font-medium text-[var(--admin-text-sub)]`}>
                Unfinished
              </span>
            </label>
          </div>
        </div>
      </div>

      {
    /* Challenge, Solution, Result */
  }
      <div className="space-y-6 mb-6">
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Challenge *
          </label>
          <textarea
    value={formData.challenge}
    onChange={(e) => onFormChange("challenge", e.target.value)}
    placeholder="Describe the challenge or problem"
    rows={4}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
        <div>
          <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
            Solution *
          </label>
          <textarea
    value={formData.solution}
    onChange={(e) => onFormChange("solution", e.target.value)}
    placeholder="Describe the solution or approach"
    rows={4}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none bg-[var(--admin-bg-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
        </div>
      </div>

      {
    /* Content Sections */
  }
      <div className="space-y-6 mb-8">
        <h5 className={`text-sm font-bold text-[var(--admin-text)]`}>
          Content Sections
        </h5>
        {[1, 2, 3, 4, 5].map((num) => <div key={num} className={`p-6 rounded-2xl bg-[var(--admin-bg-soft)]`}>
            <div className="mb-4">
              <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
                Topic {num}
              </label>
              <input
    type="text"
    value={formData[`topic${num}`]}
    onChange={(e) => onFormChange(`topic${num}`, e.target.value)}
    placeholder={`Enter topic ${num}`}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 text-[var(--admin-text-sub)]`}>
                Content {num}
              </label>
              <textarea
    value={formData[`content${num}`]}
    onChange={(e) => onFormChange(`content${num}`, e.target.value)}
    placeholder={`Enter content for section ${num}`}
    rows={4}
    className={`w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] focus:border-[var(--admin-accent)]`}
  />
            </div>
          </div>)}
      </div>

      {
    /* Action Buttons */
  }
      <div className="flex gap-4">
        <button
    type="button"
    onClick={onReset}
    disabled={isLoading}
    className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-colors bg-[var(--admin-bg-soft)] text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)] disabled:opacity-50`}
  >
          {isEditMode ? "Cancel Edit" : "Reset Form"}
        </button>
        <button
    type="button"
    onClick={onSubmit}
    disabled={isLoading}
    className="flex-1 px-6 py-3 bg-[var(--admin-accent)] text-white rounded-2xl font-bold hover:bg-[var(--admin-accent-hover)] transition-colors disabled:opacity-50"
  >
          {isLoading ? "Processing..." : isEditMode ? "Update Case Study" : "Create Case Study"}
        </button>
      </div>
    </div>;
};
export {
  FormSection
};
