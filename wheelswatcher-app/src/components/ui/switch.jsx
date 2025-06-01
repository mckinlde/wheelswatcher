import React from "react";

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="relative inline-block w-10 h-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="opacity-0 w-0 h-0"
      />
      <span
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition ${
          checked ? "bg-blue-600" : ""
        }`}
      />
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </label>
  );
};

export { Switch };
