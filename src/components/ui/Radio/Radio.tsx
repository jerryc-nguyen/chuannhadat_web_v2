import React from 'react';

interface RadioProps {
  label: string | React.ReactNode; // Allow both string and ReactNode
  checked: boolean;
  onChange: () => void;
  labelClassName?: string;
}

const Radio: React.FC<RadioProps> = ({ label, checked, onChange, labelClassName }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-4 h-4 mr-2 rounded-full border-2 border-gray-400 flex items-center justify-center ${checked ? 'bg-blue-500' : 'bg-white'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <span className={labelClassName || ""}>{label}</span> {/* This can now accept either string or ReactNode */}
    </label>
  );
};

export default Radio;
