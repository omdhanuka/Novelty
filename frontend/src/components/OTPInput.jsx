import { useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value = '', onChange, onComplete }) => {
  const inputRefs = useRef([]);
  
  // Convert value string to array for display
  const otp = value ? value.split('').slice(0, length) : [];
  while (otp.length < length) {
    otp.push('');
  }

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    const otpString = newOtp.join('');
    if (onChange) onChange(otpString);

    // Move to next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onComplete when all fields are filled
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        if (onChange) onChange(newOtp.join(''));
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

    const newOtp = pastedData.split('');
    while (newOtp.length < length) {
      newOtp.push('');
    }
    
    const otpString = newOtp.join('');
    if (onChange) onChange(otpString);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex].focus();

    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          style={{
            caretColor: 'transparent',
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
