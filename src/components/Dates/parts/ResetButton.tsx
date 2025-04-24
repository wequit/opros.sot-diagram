import React from 'react';

interface ResetButtonProps { onReset: () => void; label: string; }
const ResetButton: React.FC<ResetButtonProps> = ({ onReset, label }) => (
  <button onClick={onReset} className="px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 flex items-center gap-2 shadow-sm border-b-2 border-red-100 hover:border-red-200">
    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
    <span className="hidden xs530:inline">{label}</span>
  </button>
);
export default ResetButton;