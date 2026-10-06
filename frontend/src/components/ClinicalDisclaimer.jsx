import React from 'react';

const ClinicalDisclaimer = ({ onClose }) => {
  return (
    <div className="relative bg-gradient-to-r from-red-50 to-orange-50/50 backdrop-blur-sm border border-red-200 text-slate-800 p-5 rounded-2xl shadow-sm overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-2xl"></div>
      <h3 className="text-lg font-extrabold flex items-center gap-2 mb-2 text-red-700 ml-2">
        <span role="img" aria-label="warning" className="animate-pulse-soft">⚠️</span> Clinical Warning
      </h3>
      <p className="text-sm md:text-base leading-relaxed ml-2 text-slate-700">
        This app uses the Personal Fat Threshold (PFT) and low-calorie protocols.
        <strong className="font-bold text-red-800"> IF YOU ARE ON DIABETES MEDICATION (e.g., Insulin, Sulfonylureas)</strong>, 
        reducing food intake can cause dangerous <strong className="font-bold text-red-800">hypoglycemia</strong> (low blood sugar).
        Please consult your doctor to adjust your medication before starting this protocol.
      </p>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-100/50 p-1.5 rounded-full transition-colors active:scale-95"
          aria-label="Close disclaimer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ClinicalDisclaimer;
