'use client';
import { useState, useEffect } from 'react';

const CountdownTimer = ({ initialTime, onFinish, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  if (timeLeft === 0) {
    return (
      <button
        onClick={onResend}
        className="text-blue-500 text-sm underline"
      >
        Resend OTP
      </button>
    );
  }

  return (
    <span className="text-sm text-gray-500">
      Resend OTP in {Math.floor(timeLeft / 60)}:
      {String(timeLeft % 60).padStart(2, '0')}
    </span>
  );
};

export default CountdownTimer;