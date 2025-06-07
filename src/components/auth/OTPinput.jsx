'use client';
import { useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, showVerifyButton, onVerify }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 6) {
      onChange(input);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        className="p-2 border rounded w-32"
        maxLength={6}
        placeholder="Enter OTP"
      />
      {showVerifyButton && value.length === 6 && (
        <button
          onClick={onVerify}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Verify
        </button>
      )}
    </div>
  );
};

export default OTPInput;