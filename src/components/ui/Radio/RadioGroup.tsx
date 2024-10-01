// RadioGroup.tsx
import React from 'react';
import Radio from './Radio';

interface RadioGroupProps {
  options: Array<{ label: React.ReactNode; value: number }>;
  selectedValue: number;
  onChange: (value: number) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <Radio
          key={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};

export default RadioGroup;
