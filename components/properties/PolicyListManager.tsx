type PolicyListManagerProps = {
  title: string;
  items: string[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
  maxW?: string;
};

export function PolicyListManager({
  title,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  maxW = 'max-w-md',
}: PolicyListManagerProps) {
  return (
    <div className="pt-3 border-t border-gray-100">
      <label className="block font-semibold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
        {title}
      </label>
      <div className={`flex gap-2 ${maxW} mb-2`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200/60 text-gray-800 text-[11px] px-2.5 py-0.5 rounded-md font-medium"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-400 hover:text-red-600 cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}