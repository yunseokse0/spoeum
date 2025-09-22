import React from 'react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({ 
  id, 
  checked = false, 
  onCheckedChange, 
  className = '', 
  disabled = false 
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${className}`}
    />
  );
}
