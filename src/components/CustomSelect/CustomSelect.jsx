'use client'
import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CustomSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  label = '',
  required = false,
  disabled = false,
  className = '',
  error = '',
  id = '',
  name = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (isOpen && selectRef.current && dropdownRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;

      // If not enough space below and more space above, position upward
      if (spaceBelow < dropdownHeight + 10 && spaceAbove > dropdownHeight + 10) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!disabled) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            setIsOpen(false);
          }
          break;
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label 
          className="block text-[#015990] font-medium mb-2 dark:text-gray-100" 
          htmlFor={id}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        id={id}
        name={name}
        className={`
          w-full pl-3 pr-3 py-2 border rounded-lg cursor-pointer
          flex items-center justify-between relative
          ${disabled 
            ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50' 
            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
          }
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-[#015990] focus:ring-[#015990]'
          }
          ${isOpen ? 'ring-1' : ''}
          text-gray-700 dark:text-gray-100
          focus:outline-none transition-colors duration-200
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        <span className={`flex-1 truncate ${selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className="flex items-center ml-2 flex-shrink-0">
          {isOpen ? (
            <FaChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-0 right-0 z-50 
            bg-white dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded-lg shadow-lg
            max-h-60 overflow-y-auto
            ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
              No options available
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value || index}
                className={`
                  px-3 py-2 cursor-pointer transition-colors duration-150
                  hover:bg-gray-100 dark:hover:bg-gray-600
                  ${option.value === value 
                    ? 'bg-[#015990] text-white' 
                    : 'text-gray-900 dark:text-gray-100'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                `}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;