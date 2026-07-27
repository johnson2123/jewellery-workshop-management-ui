import { useRef } from 'react';

/**
 * Reusable 6-digit OTP input component.
 * @param {{ value: string[], onChange: (otp: string[]) => void, disabled?: boolean }} props
 */
export const OtpInput = ({ value = ['', '', '', '', '', ''], onChange, disabled = false }) => {
  const inputRefs = useRef([]);

  const handleDigitChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val.slice(-1);
    onChange(newOtp);

    // Auto-advance to next input field
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: clear current or move to previous field
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      onChange(digits);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleDigitChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl bg-slate-800/90 border border-slate-700/80 text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-all shadow-inner"
        />
      ))}
    </div>
  );
};

export default OtpInput;