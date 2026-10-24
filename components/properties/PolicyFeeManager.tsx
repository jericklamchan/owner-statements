type Fee = { name: string; amount: string };

type PolicyFeeManagerProps = {
  fees: Fee[];
  feeName: string;
  feeAmount: string;
  onNameChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function PolicyFeeManager({
  fees,
  feeName,
  feeAmount,
  onNameChange,
  onAmountChange,
  onAdd,
  onRemove,
}: PolicyFeeManagerProps) {
  return (
    <div className="pt-3 border-t border-gray-100">
      <label className="block font-semibold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
        Additional Fixed Fees
      </label>
      <div className="flex gap-2 max-w-lg mb-2">
        <input
          type="text"
          value={feeName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Fee name (e.g. Internet)"
          className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          value={feeAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Amount"
          className="w-28 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none font-mono"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer"
        >
          Add
        </button>
      </div>
      {fees.length > 0 && (
        <div className="space-y-1.5 mt-2 max-w-lg">
          {fees.map((fee, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50/60 border border-gray-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="font-medium text-gray-800">{fee.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-bold font-mono">${fee.amount}</span>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}