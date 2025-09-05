import { useState, useRef, useEffect } from 'react';

const statuses = ['All', 'Unsold', 'Hold', 'Sold'];

export default function CustomSelect({ filterStatus, setFilterStatus }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm flex justify-between items-center hover:border-blue-500 focus:outline-none"
      >
        {`Status (${filterStatus})`}

        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md text-sm">
          {statuses.map((status) => (
            <li
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                filterStatus === status ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              {status === 'All' ? 'Status (All)' : status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
