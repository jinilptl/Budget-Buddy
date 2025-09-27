import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <label className="text-sm font-semibold">{label}</label>
      <div
        className="border rounded p-2 mt-1 cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{value || `Select ${label}`}</span>
        <span className="ml-2">▼</span>
      </div>

      {open && (
        <ul className="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border rounded mt-1 shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
