type PolicyTextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helperText?: string;
  rows?: number;
};

export function PolicyTextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  rows = 3,
}: PolicyTextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-gray-700 mb-1 text-xs">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-800 resize-none shadow-2xs focus:border-blue-500 focus:outline-none transition-all"
      />
      {helperText && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}