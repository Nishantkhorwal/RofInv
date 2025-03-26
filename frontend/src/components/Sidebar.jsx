import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client"; // Import the socket.io client
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FaCircleUser, FaEyeSlash, FaPen, FaTrash } from "react-icons/fa6";
import { FaEye, FaHome } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { TbHomeCheck } from "react-icons/tb";
import { TbHomeX } from "react-icons/tb";
import { TbHomeDollar } from "react-icons/tb";
import { LuArrowRight } from "react-icons/lu";
import { BiSolidDashboard } from "react-icons/bi";
import { IoFolderSharp } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { IoIosCreate } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { CiEdit } from "react-icons/ci";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// Initialize the WebSocket connection
const socket = io("https://inventorybackend-bf15.onrender.com");

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');  // Set default to 'projects'
  const [projectInventories, setProjectInventories] = useState([]);
  const [saleRequests, setSaleRequests] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Pending'); // Track selected category
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  const navigate = useNavigate(); // To handle navigation

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    socket.on('requestUpdated', (updatedRequest) => {
      console.log('Received updated request:', updatedRequest);  // Log received data
      setSaleRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        const newStatus = updatedRequest.status.toLowerCase();
        let updated = false;

        console.log('Updated status:', newStatus);

        // Iterate through categories to check for the requestId
        Object.keys(updatedRequests).forEach((category) => {
          updatedRequests[category] = updatedRequests[category].map((req) => {
            console.log('Checking request:', req._id);  // Log each request's ID for comparison

            if (req._id === updatedRequest.requestId) {
              updated = true;
              return { ...req, ...updatedRequest };  // Update the request if found
            }
            return req;
          });
        });

        console.log('Updated state:', updatedRequests);

        if (!updated) {
          console.warn('Request not found in the existing saleRequests:', updatedRequest);
        }

        return updatedRequests;
      });
    });

    return () => {
      socket.off('requestUpdated');
    };
  }, [socket]);
  // Make sure socket is part of the dependency array





  // Fetch all project inventories
  useEffect(() => {
    if (activeTab === 'projects' || activeTab === 'dashboard' || activeTab === 'createExecutive') {
      const fetchInventories = async () => {
        setLoading(true);
        setError(null);
        try {
          // Retrieve token from localStorage
          const token = localStorage.getItem('token');
          
          // Check if the token exists
          if (!token) {
            throw new Error('No authentication token found');
          }
  
          // Make the API request with the Authorization header
          const response = await fetch('https://inventorybackend-bf15.onrender.com/api/project/inventories', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch inventories');
          }
          const data = await response.json();
          setProjectInventories(data.projectInventories || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchInventories();
    }
    
    if (activeTab === 'requests' || activeTab === 'dashboard') {
      const fetchSaleRequests = async () => {
        setLoading(true);
        setError(null);
        try {
          // Retrieve token from localStorage
          const token = localStorage.getItem('token');
          
          // Check if the token exists
          if (!token) {
            throw new Error('No authentication token found');
          }
  
          // Make the API request with the Authorization header
          const response = await fetch('https://inventorybackend-bf15.onrender.com/api/project/request', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch sale requests');
          }
          const data = await response.json();
  
          console.log(data); // Log to check the data structure
  
          const saleRequests = data.saleRequests || []; // Get the array or an empty array if undefined
          setHasPendingRequests(saleRequests.some(request => request.status === 'Pending'));
  
          const pending = saleRequests.filter(request => request.status === 'Pending');
          const approved = saleRequests.filter(request => request.status === 'Approved');
          const rejected = saleRequests.filter(request => request.status === 'Rejected');
          setSaleRequests({ pending, approved, rejected });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSaleRequests();
    }
  }, [activeTab]);
  

  // Render sale requests in a table

  const [requestSearchTerm, setRequestSearchTerm] = useState(""); // Renamed for uniqueness
  const [requestPage, setRequestPage] = useState(1);
  const requestItemsPerPage = 4; // Number of requests per page

  const renderRequestsTable = () => {
    const categories = ['Pending', 'Approved', 'Rejected']; // Possible categories
    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      setRequestPage(1); // Reset to page 1 when changing category
    };

    const handleAction = async (requestId, action) => {
      try {
        const response = await fetch(`https://inventorybackend-bf15.onrender.com/api/project/requests/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }), // Send the action (approve or reject)
        });

        const data = await response.json();
        if (data.success) {
          setSaleRequests((prevRequests) => {
            const updatedRequests = { ...prevRequests };

            Object.keys(updatedRequests).forEach((category) => {
              updatedRequests[category] = updatedRequests[category].filter((req) => req._id !== requestId);
            });

            const updatedRequest = {
              ...data.saleRequest,
              inventoryId: data.inventoryItem,
            };

            const newStatus = updatedRequest.status.toLowerCase();
            if (!updatedRequests[newStatus]) {
              updatedRequests[newStatus] = [];
            }
            updatedRequests[newStatus].push(updatedRequest);

            return updatedRequests;
          });

          console.log(`Sale request ${action}ed successfully`);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error handling action:', error);
      }
    };

    const renderTable = (category) => {
      const requests = saleRequests[category.toLowerCase()] || [];

      // Apply search filter
      const filteredRequests = requests.filter((request) =>
        request.inventoryId.customerName?.toLowerCase().includes(requestSearchTerm.toLowerCase())
      );

      // Apply pagination
      const totalPages = Math.ceil(filteredRequests.length / requestItemsPerPage);
      const startIndex = (requestPage - 1) * requestItemsPerPage;
      const currentRequests = filteredRequests.slice(startIndex, startIndex + requestItemsPerPage);
      if (currentRequests.length === 0) {
        return (
          <p className="text-center text-gray-500 py-10">
            No {category.toLowerCase()} requests.
          </p>
        );
      }

      return (
        <>
          {currentRequests.length > 0 ? (
            <table className="table-auto bg-white border border-b-gray-950 border-collapse rounded-md shadow-xl text-center w-full mt-2">
              <thead className="border border-b-gray-950">
                <tr>
                  <th className="px-4 py-2">Executive</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Status</th>
                  {category === 'Pending' && <th className="px-4 py-2">Actions</th>}
                  <th className="text-center px-4 py-2">Download</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-4 py-4">{request.createdBy.name || 'No Executive'}</td>
                    <td className="px-4 py-4">{request.inventoryId.customerName || 'No Customer'}</td>
                    <td className="px-4 py-4">{request.inventoryId.unitNumber || 'No Unit '}</td>
                    <td className="px-4 py-4">{request.status}</td>
                    {request.status === 'Pending' && (
                      <td className="text-center px-4 py-4">
                        <button
                          onClick={() => handleAction(request._id, 'approve')}
                          className="bg-green-500 rounded-lg shadow-xl text-sm text-white lg:mb-0 lg:mr-2 lg:px-3 lg:py-1 lg:text-base mb-2 px-1 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(request._id, 'reject')}
                          className="bg-red-500 rounded-lg shadow-xl text-sm text-white lg:px-3 lg:text-base px-1 py-1"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                    <td className="px-3 py-4">
                      <a
                        href={`https://inventorybackend-bf15.onrender.com/${request.inventoryId.chequeImagePath}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="bg-gray-500 rounded-lg shadow-xl text-sm text-white lg:mb-0 lg:me-4 lg:px-3 lg:text-base mb-2 px-1 py-1">
                          Cheque
                        </button>
                      </a>
                      <a
                        href={`https://inventorybackend-bf15.onrender.com/${request.inventoryId.panCardImagePath}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="bg-gray-500 rounded-lg shadow-xl text-sm text-white lg:px-3 lg:text-base px-1 py-1">
                          Pan Card
                        </button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-10 py-10">No {category.toLowerCase()} requests.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex justify-center mt-4">
                <button
                  disabled={requestPage === 1}
                  onClick={() => setRequestPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-4 text-2xl py-2 ${requestPage === 1 ? 'text-gray-400' : 'text-black'}`}
                >
                  <RiArrowLeftSLine />
                </button>

                <button
                  disabled={requestPage === totalPages}
                  onClick={() => setRequestPage((prev) => Math.min(prev + 1, totalPages))}
                  className={`px-4 text-2xl py-2 ${requestPage === totalPages ? 'text-gray-400' : 'text-black'}`}
                >
                  <RiArrowRightSLine />
                </button>
              </div>
              <div className="flex justify-center mx-4">
                Page {requestPage} of {totalPages}
              </div>
            </>
          )}
        </>
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-row rounded-lg w-full lg:py-10 py-16">
          {categories.map((category) => (
            <div className={`${selectedCategory === category ? 'rounded-xl bg-white' : ''} border w-1/3 border-t border-b`} key={category}>
              <p
                onClick={() => handleCategoryChange(category)}
                className={`${selectedCategory === category ? 'border-red-500 border rounded-lg shadow-xl' : 'rounded-lg shadow-none'
                  } font-semibold cursor-pointer text-center py-2`}
              >
                {category}
              </p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search customer..."
            value={requestSearchTerm}
            onChange={(e) => setRequestSearchTerm(e.target.value)}
            className="border rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        {/* Render the table for the selected category */}
        <div className="flex space-x-4">
          <div className="flex-1 overflow-y-hidden">{renderTable(selectedCategory)}</div>
        </div>
      </div>
    );
  };



  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filterStatus, setFilterStatus] = useState("All"); // Status filter state
  const [selectedProject, setSelectedProject] = useState("All"); // Selected project filter
  const itemsPerPage = 4; // Number of projects per page  
  const [filterPLC, setFilterPLC] = useState("All"); // PLC filter state
  const [towerSearchQueries, setTowerSearchQueries] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);



  const handleStatusChange = async (inventoryId, newStatus) => {
    // Optimistic UI update: immediately reflect the status change in the UI
    setProjectInventories((prevInventories) => {
      return prevInventories.map((project) => {
        project.inventory = project.inventory.map((item) => {
          if (item._id === inventoryId) {
            return { ...item, status: newStatus }; // Optimistically update the status
          }
          return item;
        });
        return project;
      });
    });
  
    try {
      const response = await fetch(`https://inventorybackend-bf15.onrender.com/api/project/inventory/${inventoryId}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const result = await response.json();
      if (response.ok && result.success) {
        console.log(`Status updated to ${newStatus} successfully.`);
      } else {
        // If the API call fails, revert the optimistic change
        setProjectInventories((prevInventories) => {
          return prevInventories.map((project) => {
            project.inventory = project.inventory.map((item) => {
              if (item._id === inventoryId) {
                return { ...item, status: item.status }; // Revert the change
              }
              return item;
            });
            return project;
          });
        });
        alert(result.message || 'Failed to update status.');
      }
    } catch (error) {
      // If an error occurs, revert the optimistic change
      setProjectInventories((prevInventories) => {
        return prevInventories.map((project) => {
          project.inventory = project.inventory.map((item) => {
            if (item._id === inventoryId) {
              return { ...item, status: item.status }; // Revert the change
            }
            return item;
          });
          return project;
        });
      });
      console.error('Error updating status:', error);
      alert('Error updating status.');
    }
  };
  
  
  const renderProjectsTable = () => {
    // Filter projects based on search query, status, and selected project
    const filteredProjects = projectInventories
      .filter((project) => {
        if (selectedProject !== "All" && project.projectName !== selectedProject) return false;
        return project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((project) => {
        const towerSearchQuery = towerSearchQueries[project.projectId] || "";
  
        const filteredInventory = project.inventory.filter((item) => {
          if (filterStatus !== "All" && item.status !== filterStatus) return false;
          if (filterPLC === "Yes" && !item.PLC) return false;
          if (filterPLC === "No" && item.PLC) return false;
  
          // Apply tower/unit search filter specific to this project
          if (
            towerSearchQuery &&
            !item.floor.toLowerCase().includes(towerSearchQuery.toLowerCase()) &&
            !item.unitNumber.toLowerCase().includes(towerSearchQuery.toLowerCase())
          ) {
            return false;
          }
  
          return true;
        });
  
        return {
          ...project,
          inventory: filteredInventory,
        };
      })
      .filter((project) => project.inventory.length > 0 || towerSearchQueries[project.projectId]);
  
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  
    if (loading) return <p>Loading inventories...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
  
    return (
      <div className="py-10">
        {/* Header */}
        <h2 className="text-2xl text-center font-bold lg:text-4xl mb-6">
          Project Inventories
        </h2>
  
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex">
            {/* Project Dropdown */}
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setCurrentPage(1); // Reset pagination when changing project
              }}
              className="border rounded-lg shadow-sm mr-4 px-4 py-2"
            >
              <option value="All">All Projects</option>
              {projectInventories.map((project) => (
                <option key={project.projectId} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
  
            {/* Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg shadow-sm mr-4 px-4 py-2"
            >
              <option value="All">Status(All)</option>
              <option value="Unsold">Unsold</option>
              <option value="Hold">Hold</option>
              <option value="Sold">Sold</option>
            </select>
            
            {/* PLC Filter Dropdown */}
            {/* <select
              value={filterPLC}
              onChange={(e) => setFilterPLC(e.target.value)}
              className="border rounded-lg shadow-sm mr-4 px-4 py-2"
            >
              <option value="All">PLC (All)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select> */}
          </div>
  
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-lg shadow-sm px-4 py-2"
          />
        </div>
  
        {/* Message for No Project Matches */}
        {searchQuery && filteredProjects.length === 0 && (
          <div className="text-center text-red-500 py-2">
            <p>No projects match this search result.</p>
          </div>
        )}
  
        {/* Project Table */}
        {currentProjects.map((project) => (
          <div
            key={project.projectId}
            className="bg-white border border-gray-300 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-2xl mb-8 overflow-y-hidden pb-6"
          >
            <div className="flex flex-row justify-between lg:border-b px-20 py-4">
              <h3 className="text-center text-lg font-bold lg:text-3xl">
                {project.projectName}
              </h3>
              <input
                type="text"
                placeholder="Search towers or units..."
                value={towerSearchQueries[project.projectId] || ""}
                onChange={(e) => {
                  setTowerSearchQueries({
                    ...towerSearchQueries,
                    [project.projectId]: e.target.value,
                  });
                }}
                className="border rounded-lg shadow-sm ml-4 px-4 py-2"
              />
            </div>
  
            {/* Inventory Table or No Inventory Message */}
            {project.inventory.length > 0 ? (
              <div className="overflow-auto max-h-[100vh]">
              <table className="table-auto text-center w-full mt-2">
                <thead className='sticky top-0 bg-white z-10'>
                  <tr>
                    <th className="px-4 py-2">AREA (Sq.Yard)</th>
                    <th className="px-4 py-2">W</th>
                    <th className="px-4 py-2">L</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Unit No.</th>
                    <th className="px-4 py-2">Floor</th>
                    <th className="px-4 py-2">Carpet Area</th>
                    <th className="px-4 py-2">Terrace Area</th>
                    <th className="px-4 py-2">Stilt Area</th>
                    <th className="px-4 py-2">Basement Area</th>
                    <th className="px-4 py-2">Mumty</th>
                    <th className="px-4 py-2">Common Area</th>
                    <th className="px-4 py-2">Actual Area</th>
                    <th className="px-1 py-2">Saleable Area</th>
                    <th className="px-4 py-2">PLC</th>
                    <th className="px-4 py-2">PLC Charges</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.inventory.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.areaSqYard}</td>
                      <td className="px-4 py-2">{item.W}</td>
                      <td className="px-4 py-2">{item.L}</td>
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2">{item.unitNumber}</td>
                      <td className="px-4 py-2">{item.floor}</td>
                      <td className="px-4 py-2">{item.carpetArea}</td>
                      <td className="px-4 py-2">{item.terraceArea}</td>
                      <td className="px-4 py-2">{item.stiltArea}</td>
                      <td className="px-4 py-2">{item.basementArea}</td>
                      <td className="px-4 py-2">{item.mumty}</td>
                      <td className="px-4 py-2">{item.commonArea}</td>
                      <td className="px-4 py-2">{item.actualArea}</td>
                      <td className="px-4 py-2">{item.saleableArea}</td>
                      <td className="px-4 py-2">{item.PLC}</td>
                      <td className="px-4 py-2">{item.plcCharges}</td>
                      <td className="px-4 py-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`font-bold cursor-pointer text-center px-2 py-1 rounded ${
                            item.status === "Sold"
                              ? "text-green-600"
                              : item.status === "Unsold"
                              ? "text-red-600"
                              : "text-yellow-500"
                          }`}
                        >
                          <option value="Sold">Sold</option>
                          <option value="Unsold">Unsold</option>
                          <option value="Hold">Hold</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className='px-20 py-10'>No Unit or Tower matches this search result.</p>
            )}
          </div>
        ))}
  
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mb-3 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`mx-2 text-black text-3xl rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <RiArrowLeftSLine />
            </button>
  
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`mx-2 text-black text-3xl rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <RiArrowRightSLine />
            </button>
          </div>
        )}
        <p className="text-center mx-2">{`Page ${currentPage} of ${totalPages}`}</p>
      </div>
    );
  };
   
  const [chosenProject, setChosenProject] = useState(null);
  const renderDashboardTable = () => {
    // State to store the selected project
    
    
    const userName = localStorage.getItem("userName") || "Manish Mittal";
    
    // Filtered projectInventories based on the chosen project
    const selectedProjectData = chosenProject
        ? projectInventories.filter(project => project.projectName === chosenProject)
        : projectInventories;

    const totalProperties = selectedProjectData.reduce((total, project) => total + project.inventory.length, 0);

    const soldProperties = selectedProjectData.reduce((total, project) => {
      return total + project.inventory.filter(item => item.status === 'Sold').length;
    }, 0);

    const unsoldProperties = selectedProjectData.reduce((total, project) => {
      return total + project.inventory.filter(item => item.status === 'Unsold').length;
    }, 0);

    const holdProperties = selectedProjectData.reduce((total, project) => {
      return total + project.inventory.filter(item => item.status === 'Hold').length;
    }, 0);
    
    const dataByMonthSold = {};
    const dataByMonthHold = {};

    selectedProjectData.forEach((project) => {
      project.inventory.forEach((item) => {
        // Sold Properties logic
        if (item.status === 'Sold') {
          const soldDate = item.createdAt ? new Date(item.createdAt) : null;
          if (soldDate && !isNaN(soldDate.getTime())) {
            const soldMonth = soldDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!dataByMonthSold[soldMonth]) {
              dataByMonthSold[soldMonth] = 0;
            }
            dataByMonthSold[soldMonth]++;
          }
        }
        // Hold Properties logic
        if (item.status === 'Hold') {
          const holdDate = item.createdAt ? new Date(item.createdAt) : null;
          if (holdDate && !isNaN(holdDate.getTime())) {
            const holdMonth = holdDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!dataByMonthHold[holdMonth]) {
              dataByMonthHold[holdMonth] = 0;
            }
            dataByMonthHold[holdMonth]++;
          }
        }
      });
    });

    const monthsSold = Object.keys(dataByMonthSold).sort((a, b) => new Date(a) - new Date(b));
    const soldCounts = monthsSold.map((month) => dataByMonthSold[month]);

    const monthsHold = Object.keys(dataByMonthHold).sort((a, b) => new Date(a) - new Date(b));
    const holdCounts = monthsHold.map((month) => dataByMonthHold[month]);

    // Line Chart Data
    const soldChartData = {
      labels: monthsSold,
      datasets: [
        {
          label: 'Sold Properties',
          data: soldCounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Line Chart Data for Hold Properties
    const holdChartData = {
      labels: monthsHold,
      datasets: [
        {
          label: 'Hold Properties',
          data: holdCounts,
          borderColor: 'rgba(255, 159, 64, 1)', // Different color for Hold chart
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const firstProperties = selectedProjectData.slice(0, 2);
    const recentRequests = saleRequests.pending.slice(0, 2);

    return (
      <>
        <div className='pe-20'>
          <div className='flex flex-row justify-between items-center py-5'>
          <div className='flex flex-row justify-between items-center space-x-6'>
            <h1 className='text-3xl font-bold uppercase'>Dashboard</h1>
            
            <div className="relative">
              <select
                value={chosenProject || ''}
                onChange={(e) => setChosenProject(e.target.value)}
                className="border-2 p-2 rounded-lg"
              >
                <option value="">All Projects</option>
                {projectInventories.map((project) => (
                  <option key={project.projectName} value={project.projectName}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            </div>
            <div className='relative'>
              <div className='flex flex-row cursor-pointer items-center' onClick={toggleDropdown}>
                <p className='font-semibold me-2'>{userName}</p>
                <FaCircleUser className='text-2xl' />
              </div>
              {dropdownVisible && (
                <div className='bg-white border border-gray-300 rounded-lg shadow-lg w-48 absolute mt-2 right-0'>
                  <ul>
                    <li onClick={() => setActiveTab('profile')} className='cursor-pointer hover:bg-gray-100 px-4 py-2'>Profile</li>
                    <li onClick={handleLogout} className='cursor-pointer hover:bg-gray-100 px-4 py-2'>Logout</li>
                  </ul>
                </div>
              )}
            </div>
            
          </div>

          <div className='py-5'>
            <div className='flex flex-row w-full space-x-6'>
              <div className='flex flex-col bg-white rounded-lg shadow-lg w-[25%] px-10 py-5'>
                <FaHome className='text-4xl text-yellow-500 mb-4' />
                <p className='text-sm font-semibold mb-5 uppercase'>Total Properties</p>
                <p className='text-lg font-bold'>{totalProperties}</p>
              </div>
              <div className='flex flex-col bg-white rounded-lg shadow-lg w-[25%] px-10 py-5'>
                <TbHomeDollar className='text-4xl text-yellow-500 mb-4' />
                <p className='text-sm font-semibold mb-5 uppercase'>Sold Properties</p>
                <p className='text-lg font-bold'>{soldProperties}</p>
              </div>
              <div className='flex flex-col bg-white rounded-lg shadow-lg w-[25%] px-10 py-5'>
                <TbHomeX className='text-4xl text-yellow-500 mb-4' />
                <p className='text-sm font-semibold mb-5 uppercase'>Unsold Properties</p>
                <p className='text-lg font-bold'>{unsoldProperties}</p>
              </div>
              <div className='flex flex-col bg-white rounded-lg shadow-lg w-[25%] px-10 py-5'>
                <TbHomeCheck className='text-4xl text-yellow-500 mb-4' />
                <p className='text-sm font-semibold mb-5 uppercase'>Hold Properties</p>
                <p className='text-lg font-bold'>{holdProperties}</p>
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="flex bg-white justify-center rounded-lg shadow-lg px-10 py-10">
              <Line data={soldChartData} options={{ responsive: true }} />
            </div>
          </div>

          <div className='flex flex-row items-center py-4 space-x-4'>
            <div className="bg-white rounded-lg shadow-lg w-[60%] px-2 py-4">
              <table className="table-auto text-center w-full mb-5">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Project Name</th>
                    <th className="px-4 py-2">Area (Sq. Yard)</th>
                    <th className="px-4 py-2">Floor</th>
                    <th className="px-4 py-2">Unit</th>
                    <th className="px-4 py-2">PLC</th>
                  </tr>
                </thead>
                <tbody>
                  {firstProperties.map((project) =>
                    project.inventory.slice(0, 1).map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-2">{project.projectName}</td>
                        <td className="px-4 py-2">{item.areaSqYard}</td>
                        <td className="px-4 py-2">{item.floor}</td>
                        <td className="px-4 py-2">{item.unitNumber}</td>
                        <td className="px-4 py-2">{item.PLC}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className='flex flex-row justify-center items-center'><p onClick={() => setActiveTab('projects')} className='text-blue-700 cursor-pointer'>All Projects</p></div>
            </div>
            <div className='bg-white rounded-lg shadow-lg w-[40%] px-2 py-4'>
              <Line data={holdChartData} options={{ responsive: true }} />
            </div>
          </div>
          {hasPendingRequests && isNotificationVisible && (
            <div className="bg-yellow-500 rounded shadow-lg text-white bottom-4 cursor-pointer fixed font-bold left-4 px-4 py-2">
              <div className="flex justify-between items-center px-3 py-4">
                <div>
                  <p>You have pending requests:</p>
                  <ul className="text-sm">
                    {recentRequests.map((request, index) => (
                      <li className="mb-4" key={index}>
                        <p>Request {index + 1}</p>
                        <p>User : {request.createdBy.name}</p>
                        <p>{request.inventoryId.customerName || 'Unknown Customer'} - Unit ({request.inventoryId.unitNumber || 'N/A'})</p>
                      </li>
                    ))}
                  </ul>
                  <div onClick={() => setActiveTab('requests')} className="flex text-blue-700 items-center mt-2">
                    <p className="me-1">All requests</p>
                    <GoArrowRight />
                  </div>
                </div>
                <button
                  className="text-white text-xl absolute font-bold right-2 top-0"
                  onClick={() => setIsNotificationVisible(false)} // Hide notification on click
                >
                  &times; {/* This is the cross symbol */}
                </button>
              </div>
            </div>
          )}


        </div>
      </>
    );
};


  const fieldLabelMap = {
    areaSqYard: "AREA (Sq.Yard)",
    W: "W",
    L: "L",
    type: "Type",
    unitNumber: "Unit Number",
    floor: "Floor",
    carpetArea: "Carpet Area",
    balconyArea: "Balcony Area",
    terraceArea: "Terrace Area",
    mumty: "Mumty",
    stiltArea: "Stilt Area",
    basementArea: "Basement Area",
    commonArea: "Common Area",
    actualArea: "Actual Area",
    saleableArea: "Saleable Area",
    PLC: "PLC",
    plcCharges: "PLC Charges",

    status: "Status", // This is always included for executives
  };
  
  const [originalProfileName, setOriginalProfileName] = useState('');
  const [originalProfilePhone, setOriginalProfilePhone] = useState('');
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profilePassword, setProfilePassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem('token');
    useEffect(() => {
      const fetchUserData = async () => {
        if (!token) {
          setProfileError('User not authenticated.');
          return;
        }
    
        try {
          const response = await fetch('https://inventorybackend-bf15.onrender.com/api/user/get', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setProfileName(data.user.name);
            setOriginalProfileName(data.user.name); // Store original name
            setProfilePhone(data.user.phone);
            setOriginalProfilePhone(data.user.phone); // Store original phone
          } else {
            setProfileError(data.message || 'Error fetching user data.');
          }
        } catch (err) {
          setProfileError('Error fetching user data.');
        }
      };
    
      fetchUserData();
    }, [token]);
    
  const renderProfileUpdate = () => {
    const handleProfileInputChange = (e) => {
      const { name, value } = e.target;
      if (name === 'name') {
        setProfileName(value);
      } else if (name === 'phone') {
        setProfilePhone(value);
      } else if (name === 'password') {
        setProfilePassword(value);
      }
    };
  
    const handleProfileUpdate = async () => {
      const updatedFields = {};
    
      // Only include fields with non-empty values
      if (profileName.trim() !== '') {
        updatedFields.name = profileName;
      } else {
        updatedFields.name = profileName || originalProfileName; // Keep the original value if blank
      }
    
      if (profilePhone.trim() !== '') {
        updatedFields.phone = profilePhone;
      } else {
        updatedFields.phone = profilePhone || originalProfilePhone; // Keep the original value if blank
      }
    
      if (profilePassword.trim() !== '') {
        updatedFields.password = profilePassword;
      }
    
      // Check if there are any valid fields to update
      if (Object.keys(updatedFields).length === 0) {
        setProfileError('At least one field with a non-empty value is required for update.');
        return;
      }
    
      setProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');
    
      try {
        const response = await fetch('https://inventorybackend-bf15.onrender.com/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setProfileSuccess('Profile updated successfully!');
          setIsEditing(false); // Stop editing once update is successful
          setTimeout(() => {
            setProfileSuccess('');
          }, 2000);
        } else {
          setProfileError(data.message || 'Error updating profile.');
        }
      } catch (err) {
        setProfileError('Error updating profile. Please try again later.');
      } finally {
        setProfileLoading(false);
      }
    };
    
    
  
    return (
      <div className="flex justify-center min-h-screen" >
        <div className='flex justify-center items-center relative'>
        

        
        <div className='flex flex-col bg-white rounded-lg shadow-xl px-20 py-10 relative'>
        <MdModeEditOutline className='absolute cursor-pointer right-4 top-4'
         onClick={() => setIsEditing(true)} />
        <div className='flex justify-center items-center'><FaCircleUser className='text-8xl mb-8'/></div>
        <div>   
        <div className='flex justify-center items-center'><h1  className="text-3xl font-semibold">Profile</h1></div>
  
        {profileError && <p className="text-red-600">{profileError}</p>}
        {profileSuccess && <p className="text-green-600">{profileSuccess}</p>}
  
        <div className="mt-4 profile-update-form">
          {isEditing ? (
            <>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profileName}
                onChange={handleProfileInputChange}
                className="border p-2 w-full mb-4"
              />
  
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={profilePhone}
                onChange={handleProfileInputChange}
                className="border p-2 w-full mb-4"
              />
               <div className='relative'>
              <label className="block mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={profilePassword}
                onChange={handleProfileInputChange}
                className="border p-2 w-full mb-4"
              />
              <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="text-gray-600 absolute right-4 top-11"
               >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
  
              <button
                onClick={handleProfileUpdate}
                disabled={profileLoading}
                className={`bg-blue-500 text-white p-2 rounded ${profileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </>
          ) : (
            <>
              <div className="profile-info">
                <p className='text-xl mb-2'><strong>Name:</strong> {profileName}</p>
                <p className='text-xl'><strong>Phone:</strong> {profilePhone}</p>
              </div>
            </>
          )}
        </div>
        </div>
        </div>
        </div>
      </div>
    );
  };
  
  
  const [users, setUsers] = useState([]); // Store users
  const [editingUser, setEditingUser] = useState(null); // Track user being edited
  const [editableData, setEditableData] = useState({}); // Store edited user data
  
  // Fetch Users from API
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
  
    if (!token) {
      console.error("No token found! Redirecting to login...");
      return; // Optionally, redirect to login
    }
  
    fetch("https://inventorybackend-bf15.onrender.com/api/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in header
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched API Data:", data);
        if (!data.users || !Array.isArray(data.users)) {
          console.error("Unexpected API response:", data);
          setUsers([]);
          return;
        }
        setUsers(data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);


  
  
  const handleEditChange = (userId, field, value) => {
    setEditableData((prev) => ({
        ...prev,
        [userId]: {
            ...prev[userId] || {},  // Ensure the user object exists
            [field]: value,
        },
    }));
};

const toggleVisibleField = (userId, field) => {
    setEditableData((prev) => {
        const userFields = prev[userId]?.visibleFields || new Set();
        const updatedFields = new Set(userFields);
        updatedFields.has(field) ? updatedFields.delete(field) : updatedFields.add(field);

        return {
            ...prev,
            [userId]: {
                ...prev[userId] || {},
                visibleFields: updatedFields,
            },
        };
    });
};

const toggleAssignedProject = (user, projectId) => {
  setEditableData((prev) => {
    const currentProjects = new Set(prev[user._id]?.assignedProjects || user.assignedProjects || []);

    if (currentProjects.has(projectId)) {
      currentProjects.delete(projectId);
    } else {
      currentProjects.add(projectId);
    }

    return {
      ...prev,
      [user._id]: {
        ...prev[user._id],
        assignedProjects: Array.from(currentProjects),
      },
    };
  });
};



  
  // Save Updated User Data
  const saveUserChanges = async (userId) => {
    try {
      const originalUser = users.find(user => user._id === userId);
      
      // Check what is currently stored
      console.log("Before Update:", originalUser);
  
      // Ensure we preserve fields
      const updatedUser = {
        ...editableData[userId],
        visibleFields: Array.from(editableData[userId]?.visibleFields || new Set(originalUser?.visibleFields || [])),
        assignedProjects: editableData[userId]?.assignedProjects || originalUser?.assignedProjects || []
      };
      if (editableData[userId]?.password) {
        updatedUser.password = editableData[userId].password;
      }
  
      console.log("Payload Sent to API:", updatedUser); // Check if visibleFields and assignedProjects are correct
  
      const res = await fetch(`https://inventorybackend-bf15.onrender.com/api/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!res.ok) throw new Error("Update failed");
  
      const updatedData = await res.json(); // Get response data
  
      console.log("Response from API:", updatedData); // Check if backend modifies the data
  
      alert("User updated successfully!");
      setEditingUser(null);
  
      // Ensure we update users with preserved fields
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                name: updatedData.name,
                phone: updatedData.phone,
                visibleFields: updatedData.visibleFields ?? originalUser.visibleFields,
                assignedProjects: updatedData.assignedProjects ?? originalUser.assignedProjects
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Update failed.");
    }
  };
  

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token"); // Get token from localStorage (or use cookies if stored there)
    
    if (!token) {
      console.error("No authentication token found");
      return;
    }
  
    try {
      const response = await fetch(`https://inventorybackend-bf15.onrender.com/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Include token in the request
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        setDeleteConfirmation(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  
  
  
  




  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {


       
      case 'dashboard':
        return renderDashboardTable();
      case 'projects':
        return renderProjectsTable();
      case 'requests':
        return renderRequestsTable();
      case 'createInventory':
        return (
          <form
            className="bg-white lg:mt-0 lg:px-20 lg:py-20 mt-32 px-4 py-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
  
              const formData = new FormData();
              const projectName = e.target.projectName.value;
              const file = e.target.file.files[0];
  
              if (!projectName || !file) {
                alert('Please provide a project name and select an Excel file.');
                return;
              }
  
              formData.append('projectName', projectName);
              formData.append('file', file);
  
              try {
                const response = await fetch('https://inventorybackend-bf15.onrender.com/api/project/create', {
                  method: 'POST',
                  body: formData,
                });
  
                if (!response.ok) {
                  throw new Error('Failed to create project and inventory');
                }
  
                const data = await response.json();
                alert(data.message || 'Project and inventory created successfully!');
              } catch (error) {
                console.error('Error:', error);
                alert('Failed to create project and inventory');
              }
            }}
          >
            <h2 className="text-2xl font-bold lg:text-4xl mb-7">Create Inventory</h2>
  
            <div>
              <label htmlFor="projectName" className="text-gray-700 block">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                required
                className="border-b border-b-black w-full block focus:outline-none mt-1"
              />
            </div>
  
            <div>
              <label htmlFor="file" className="text-gray-700 block mb-3">
                Upload Excel File
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept=".xlsx, .xls"
                required
                className="w-full block cursor-pointer focus:border-indigo-500 focus:ring-indigo-500 mb-2 mt-1"
              />
              <a href="/Format.xlsx" className="text-gray-700" download>
                Download Format Of File
              </a>
            </div>
  
            <button
              type="submit"
              className="bg-gray-700 rounded-xl text-white font-semibold hover:bg-gray-900 px-4 py-2"
            >
              SUBMIT
            </button>
          </form>
        );
      case 'createExecutive':
            return (
              <form
                className="bg-white lg:mt-0 lg:px-20 lg:py-20 mt-32 px-4 py-8 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  

                  const form = e.target; // Reference to the form element
                  const name = form.name.value;
                  const phone = form.phone.value;
                  const password = form.password.value;
                  const assignedProjects = Array.from(form.querySelectorAll('input[name="assignedProjects"]:checked'))
                    .map((project) => project.value);
                  const visibleFields = Array.from(form.querySelectorAll('input[name="visibleFields"]:checked'))
                    .map((field) => field.value);
                  console.log('Assigned Projects:', assignedProjects);
                  console.log('Visible Fields:', visibleFields);
                      

                  // Ensure 'status' is always included in visibleFields
                  if (!visibleFields.includes('status')) {
                    visibleFields.push('status');
                  }

                  if (!name || !phone || !password || assignedProjects.length === 0 || visibleFields.length === 0) {
                    alert('Please fill in all fields and select at least one project and visible field.');
                    return;
                  }

                  const payload = {
                    name,
                    phone,
                    password,
                    role: 'executive',
                    assignedProjects,
                    visibleFields,
                  };

                  try {
                    const response = await fetch('https://inventorybackend-bf15.onrender.com/api/user/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to register executive');
                    }

                    const data = await response.json();
                    alert(data.message || 'Executive registered successfully!');
                    
                    // Reset the form fields after successful registration
                    form.reset();
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to register executive');
                  }
                }}
              >
                <h2 className="text-2xl font-bold lg:text-4xl mb-7">Register CP</h2>

                <div>
                  <label htmlFor="name" className="text-gray-700 block">
                    CP Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="border-b border-b-black w-full block focus:outline-none mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-gray-700 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    required
                    className="border-b border-b-black w-full block focus:outline-none mt-1"
                  />
                </div>

                <div className='relative'>
                  <label htmlFor="password" className="text-gray-700 block">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="border-b border-b-black w-full block focus:outline-none mt-1"
                  />
                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 absolute right-4 top-7"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div>
                  <label className="text-3xl text-gray-700 block font-semibold mb-3">Assign Projects</label>
                  <div className="flex flex-wrap">
                    {projectInventories.map((project) => (
                      <div key={project.projectId} className="flex w-1/3 items-center">
                        <input
                          type="checkbox"
                          id={project.projectId}
                          name="assignedProjects"
                          value={project.projectId}
                          className="mr-2"
                        />
                        <label htmlFor={project.projectId} className="text-gray-700">
                          {project.projectName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>


                <div>
                  <label className="text-3xl text-gray-700 block font-semibold mb-3">Visible Fields</label>
                  <div className="flex flex-wrap">
                  {Object.entries(fieldLabelMap).map(([backendField, displayLabel]) => (
                    <div key={backendField} className="flex w-1/3 items-center">
                      <input
                        type="checkbox"
                        id={backendField}
                        name="visibleFields"
                        value={backendField}
                        className="mr-2"
                      />
                      <label htmlFor={backendField} className="text-gray-700">
                        {displayLabel}
                      </label>
                    </div>
                  ))}
                </div>
                </div>

                <button
                  type="submit"
                  className="bg-gray-700 rounded-xl text-white font-semibold hover:bg-gray-900 px-4 py-2"
                >
                  SUBMIT
                </button>
              </form>
            );
      case 'profile' :
        return renderProfileUpdate(); 
        case 'users':
          return (
            <div className="bg-white p-6 lg:p-12 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6">User Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(users) && users.length > 0 ? (
               users.filter(user => user.role === "executive").map(user => (
                    <div key={user._id} className="p-4 border rounded-lg shadow relative bg-gray-50">
                      {/* Edit Icon */}
                      <div className="absolute top-3 right-3 flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingUser(user._id);
                          setEditableData(prev => ({
                            ...prev,
                            [user._id]: prev[user._id] || {
                              name: user.name,
                              phone: user.phone,
                              visibleFields: new Set(user.visibleFields || [])
                            }
                          }));
                        }}
                        className=" text-gray-600 hover:text-gray-900"
                      >
                        <FaPen />
                      </button>
                      <button
                      onClick={() => setDeleteConfirmation(user._id)}
                      className="text-red-600  hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
        </div>
        {deleteConfirmation === user._id && (
        <div className="absolute top-10 right-3 z-50 bg-white shadow-lg p-3 rounded-md border">
          <p className="text-sm">Are you sure you want to delete this user?</p>
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => handleDeleteUser(user._id)} 
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-800"
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteConfirmation(null)} 
              className="bg-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      )}

        
                      <div className="mb-2">
                        <label className="text-gray-700 block">Name</label>
                        <input
                          type="text"
                          value={user._id === editingUser ? editableData[user._id]?.name || "" : user.name}
                          disabled={user._id !== editingUser}
                          onChange={(e) => handleEditChange(user._id, 'name', e.target.value)}
                          className={`border-b w-full bg-transparent ${user._id === editingUser ? 'border-black' : 'border-gray-300'}`}
                        />
                      </div>
        
                      <div className="mb-2">
                        <label className="text-gray-700 block">Phone</label>
                        <input
                          type="text"
                          value={user._id === editingUser ? editableData[user._id]?.phone || "" : user.phone}
                          disabled={user._id !== editingUser}
                          onChange={(e) => handleEditChange(user._id, 'phone', e.target.value)}
                          className={`border-b w-full bg-transparent ${user._id === editingUser ? 'border-black' : 'border-gray-300'}`}
                        />
                      </div>
                      {user._id === editingUser && (
                      <div className="mb-2">
                        <label className="text-gray-700 block">New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          value={editableData[user._id]?.password || ""}
                          onChange={(e) => handleEditChange(user._id, 'password', e.target.value)}
                          className="border-b w-full bg-transparent border-black"
                        />
                      </div>
                    )}

        
                      <div className="mb-2">
                        <label className="text-gray-700 block">Role</label>
                        <span className="text-lg font-semibold">{user.role === "executive" ? "CP" : "" }</span>
                      </div>
                      {/* Assigned Projects Dropdown */}
                      {/* Assigned Projects Checkbox */}
<div className="mb-4">
  <label className="text-gray-700 font-semibold">Assigned Projects</label>
  <div className="flex flex-wrap gap-2 mt-2">
    {projectInventories.map((project) => (
      <label key={project.projectId} className="flex items-center space-x-2">
        <input
  type="checkbox"
  disabled={user._id !== editingUser}
  checked={editableData[user._id]?.assignedProjects?.includes(project.projectId) ?? user.assignedProjects.includes(project.projectId)}
  onChange={() => toggleAssignedProject(user, project.projectId)}
  className="accent-gray-700"
/>

        <span>{project.projectName}</span>
      </label>
    ))}
  </div>
</div>


        
                      {/* Visible Fields Checkbox */}
                      <div className="mb-4">
                        <label className="text-gray-700 font-semibold">Visible Fields</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(fieldLabelMap).map(([field, label]) => (
                            <label key={field} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                disabled={user._id !== editingUser}
                                checked={editableData[user._id]?.visibleFields?.has(field) ?? user.visibleFields?.includes(field)}
                                onChange={() => toggleVisibleField(user._id, field)}
                                className="accent-gray-700"
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
        
                      {/* Save Button */}
                      {user._id === editingUser && (
                        <button
                          onClick={() => saveUserChanges(user._id)}
                          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                        >
                          Save Changes
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No users found</p>
                )}
              </div>
            </div>
          );
        
             

        
      default:
        return <p>Invalid tab selected.</p>;
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <>
      <img src='roflogo.svg ' onClick={toggleSidebar} className={`${isSidebarOpen ? 'hidden lg:hidden' : 'fixed lg:hidden'} z-50 duration-500 top-2 left-0 w-10 `}></img>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}

        <div
          className={`bg-[#F5F5DC] fixed flex-shrink-0 lg:relative   h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-16'}`}
        >
          <div className="flex h-16 justify-between items-center lg:border-b px-4 py-4">
            {isSidebarOpen ? (
              <h1 className="text-gray-700 text-xl font-bold">Admin</h1>
            ) : (
              <img
                src='roflogo.svg'
                onClick={toggleSidebar}
                className="flex justify-center text-2xl text-gray-700 w-10 cursor-pointer focus:outline-none"
              >

              </img>
            )}
            {isSidebarOpen && (
              <img
                src='roflogo.svg'
                onClick={toggleSidebar}
                className="flex justify-center text-2xl text-gray-700 w-10 cursor-pointer focus:outline-none"
              >

              </img>
            )}
          </div>

          {/* Sidebar Content */}
          {isSidebarOpen && (
            <ul className="mt-4 px-4 space-y-2">
              <li
                onClick={() => setActiveTab('dashboard')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'dashboard' ? 'bg-gray-300' : ''}`}
              >
                <p>Dashboard</p><BiSolidDashboard/>
              </li>
              <li
                onClick={() => setActiveTab('projects')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'projects' ? 'bg-gray-300' : ''}`}
              >
                Projects<IoFolderSharp/>
              </li>
              <li
                onClick={() => setActiveTab('requests')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'requests' ? 'bg-gray-300' : ''}`}
              >
                
                  <p>Selling Requests</p>
                  {/* {hasPendingRequests && (
                    <div className="bg-green-500 h-2.5 rounded-full w-2.5"></div> // Green dot
                  )} */}
                  <BiMessageRoundedDots 
                    className={` ${hasPendingRequests ? 'text-green-500' : 'text-gray-500'}`} 
                  />
              </li>
              <li
                onClick={() => setActiveTab('createInventory')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'createInventory' ? 'bg-gray-300' : ''}`}
              >
                Create Inventory<IoIosCreate/>
              </li>
              <li
                onClick={() => setActiveTab('createExecutive')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'createExecutive' ? 'bg-gray-300' : ''}`}
              >
                Create CP<IoIosCreate/>
              </li>
              <li
                onClick={() => setActiveTab('users')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'users' ? 'bg-gray-300' : ''}`}
              >
                Edit Users<CiEdit/>
              </li>
              <a href='/linkpage'>
              <li
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer `}
              >
                <p>Home</p><FaHome/>
              </li>
              </a>
            </ul>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow overflow-y-scroll bg-[#FFFDD0] transition-all duration-300 ${isSidebarOpen ? 'lg:pl-8' : 'px-6 lg:px-0 lg:pl-16'}`}
        >
          <div className="p-4">{renderContent()}</div>
        </div>
      </div>
    </>

  );
};

export default Sidebar;








