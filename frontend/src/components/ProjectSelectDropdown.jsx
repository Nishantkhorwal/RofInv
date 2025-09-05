import { useState } from "react";

const ProjectSelectDropdown = ({
  selectedProject,
  setSelectedProject,
  projectInventories,
  setCurrentPage,
}) => {
  const [open, setOpen] = useState(false);

  const projects = ['All', ...projectInventories.map((p) => p.projectName)];

  const handleSelect = (value) => {
    setSelectedProject(value);
    setCurrentPage(1); // Reset pagination
    setOpen(false);
  };

  return (
    <div className="relative inline-block me-4 text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-center hover:border-blue-500 focus:outline-none"
      >
        {selectedProject === 'All' ? 'All Projects' : selectedProject}
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
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {projects.map((projectName, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(projectName)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                selectedProject === projectName ? 'bg-blue-100 font-medium' : ''
              }`}
            >
              {projectName === 'All' ? 'All Projects' : projectName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectSelectDropdown;
