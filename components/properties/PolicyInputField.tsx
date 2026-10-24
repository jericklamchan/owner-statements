type PolicyInputFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  helperText?: string;
  placeholder?: string;
  maxW?: string;
};

export function PolicyInputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  suffix,
  helperText,
  placeholder,
  maxW = 'max-w-xs',
}: PolicyInputFieldProps) {
  return (
    <div className={maxW}>
      <label htmlFor={id} className="block font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none transition-all ${
            suffix ? 'pr-8' : ''
          } ${type === 'number' ? 'font-mono' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}