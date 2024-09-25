import React from 'react';

interface FilterProps {
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ label, options, selectedOption, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-gray-700 font-bold">{label}</label>
      <select
        className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-PrimeNearshoreLighter"
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selectedOption !== 'All' && (
        <div className="mt-2 text-sm text-PrimeNearshoreLighter">
          Selected: <strong>{selectedOption}</strong>
        </div>
      )}
    </div>
  );
};

export default Filter;
