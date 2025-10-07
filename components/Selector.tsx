
import React from 'react';

interface SelectorProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const Selector: React.FC<SelectorProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={label} className="text-sm font-medium text-slate-300">{label}</label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 transition"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
