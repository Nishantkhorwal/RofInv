import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client"; // Import the socket.io client
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FaHome } from 'react-icons/fa';

// Initialize the WebSocket connection
const socket = io(`${import.meta.env.VITE_API_BASE_URL}`); // Replace with your backend URL





const ProjectList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [projectInventories, setProjectInventories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For Sell form
  const [users, setUsers] = useState([]);
  const [ visibleFields, setVisibleFields] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    panCardImage: null,
    chequeImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // To handle navigation

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
  const token = localStorage.getItem("token"); 
  const loggedInUserName = localStorage.getItem("userName"); 

  if (!token) {
    console.error("No token found! Redirecting to login...");
    return;
  }

  fetch(`${API_BASE_URL}/api/user/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

      const loggedInUser = data.users.find(
        (user) => user.name === loggedInUserName
      );

      console.log("Logged-in user:", loggedInUser);
      console.log("Setting visible fields:", loggedInUser?.visibleFields);

      setVisibleFields(loggedInUser?.visibleFields || []);
    })
    .catch((err) => console.error("Error fetching users:", err));
}, []);

  

  // Fetch all project inventories when the "Projects" tab is active
  useEffect(() => {
    if (activeTab === 'projects') {
      const fetchInventories = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          console.log(token);
          const response = await fetch(`${API_BASE_URL}/api/project/inventories`, {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [activeTab]);

  useEffect(() => {
  const handleConnect = () => {
    console.log("Connected to server via WebSocket!");
  };

  
  const handleRequestUpdated = (update) => {
    console.log("Real-time update received:", update);
    setProjectInventories((prevInventories) =>
      prevInventories.map((project) => ({
        ...project,
        inventory: project.inventory.map((item) => {
          if (item._id === update.inventoryId) {
            // Update the inventory item status
            return { ...item, status: update.inventoryStatus };
          }
          return item;
        }),
      }))
    );
  };

  socket.on("connect", handleConnect);
  socket.on("requestUpdated", handleRequestUpdated);

  socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err);
  });

  // Cleanup function
  return () => {
    socket.off("connect", handleConnect);
    socket.off("requestUpdated", handleRequestUpdated);
    socket.disconnect();
  };
}, []);


  // Logout function
  const handleLogout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Redirect to login page
    navigate('/');
  };

  // Handle Sell button click (open the form)
  const handleSellClick = (item) => {
    setSelectedItem(item);
  };

  // Handle form field changes
  const [isChequeImageFilled, setIsChequeImageFilled] = useState(false);

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, type, files, value } = e.target;
  
    if (type === "file" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Store the actual file
      }));
  
      // Update file name for UI display
      setFileNames((prev) => ({
        ...prev,
        [name]: files[0].name || "Captured Image",
      }));
  
      // Mark the field as filled (to remove required validation)
      setIsChequeImageFilled(true);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission to hold the item
  // Handle form submission to hold the item
  
const handleSubmitForm = async (e) => {
    e.preventDefault();
  
    if (!formData.customerName || !formData.panCardImage || !formData.chequeImage) {
      alert('Please fill in all fields and upload images.');
      return;
    }
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('customerName', formData.customerName);
    formDataToSend.append('panCardImage', formData.panCardImage);
    formDataToSend.append('chequeImage', formData.chequeImage);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/project/hold/${selectedItem._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: formDataToSend
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Item successfully placed on hold.');
  
        // Update the status of the item immediately in local state
        setProjectInventories((prevInventories) => 
          prevInventories.map((project) => ({
            ...project,
            inventory: project.inventory.map((item) =>
              item._id === selectedItem._id
                ? { ...item, status: 'Hold' } // Set status to 'Hold'
                : item
            )
          }))
        );
  
        setSelectedItem(null);  // Close the form after submission
      } else {
        alert('Error placing item on hold.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const [projectSearchTerm, setProjectSearchTerm] = useState(""); // Search state
  const [selectedProject, setSelectedProject] = useState("All"); // Project dropdown state
  const [filterStatus, setFilterStatus] = useState("All"); // Status dropdown state
  const [projectPage, setProjectPage] = useState(1);
  const itemsPerPage = 2; // Number of projects per page
  const [filterPLC, setFilterPLC] = useState("All"); // PLC filter state
  const [holdByMeFilter, setHoldByMeFilter] = useState(false);
  const [myHeldInventories, setMyHeldInventories] = useState([]);


  useEffect(() => {
    if (activeTab === 'projects') {
      const fetchSaleRequests = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');
  
          console.log("Fetching sale requests...");
  
          const response = await fetch(`${API_BASE_URL}/api/project/request`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) throw new Error('Failed to fetch sale requests');
  
          const data = await response.json();
          console.log("Sale requests API response:", data);
  
          const saleRequests = Array.isArray(data.saleRequests) ? data.saleRequests : [];
          console.log("Filtered sale requests array:", saleRequests);
  
          const storedUserName = localStorage.getItem('userName');
          console.log("Stored userName from localStorage:", storedUserName);
  
          // Filter sale requests where createdBy matches userName
          const myHeldItems = saleRequests
            .filter(request => {
              return request.status === "Pending" && request.createdBy?.name === storedUserName;
            })
            .map(request => request.inventoryId);
  
          console.log("My Held Inventory IDs:", myHeldItems);
  
          setMyHeldInventories(myHeldItems);
        } catch (err) {
          console.error("Error fetching sale requests:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSaleRequests();
    }
  }, [activeTab]);
  
  


  const [inventorySearchTerm, setInventorySearchTerm] = useState("");


const renderProjectsTable = () => {
  if (loading) return <p>Loading inventories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (projectInventories.length === 0) return <p>No projects found.</p>;

  // Apply search, project, and status filters
  const filteredProjects = projectInventories
  .filter((project) => {
    if (selectedProject !== "All" && project.projectName !== selectedProject) return false;
    return project.projectName.toLowerCase().includes(projectSearchTerm.toLowerCase());
  })
  .map((project) => ({
    ...project,
    inventory: project.inventory.filter((item) => {
      if (item.status === "Sold") return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
      if (filterPLC === "Yes" && !item.PLC) return false;
      if (filterPLC === "No" && item.PLC) return false;

      // Apply "Hold By Me" filter
      if (holdByMeFilter && !myHeldInventories.some(heldItem => heldItem._id === item._id)) return false;

      if (inventorySearchTerm) {
        const searchTerm = inventorySearchTerm.toLowerCase();
        if (!item.unitNumber.toLowerCase().includes(searchTerm) && !item.floor.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }


      return true;
    }),
  }))
  .filter((project) => project.inventory.length > 0);


  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (projectPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#FFFDD0]">
      {/* Header */}
      <h2 className="text-2xl text-center font-bold lg:text-4xl mb-6">Project Inventories</h2>
      <div className="flex flex-wrap justify-between gap-4 items-center mb-5">
        <div className="flex flex-wrap gap-4 lg:gap-0 lg:space-x-4">
          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border rounded-lg shadow-sm px-4 py-2"
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
            className="border rounded-lg shadow-sm px-4 py-2"
          >
            <option value="All">Status(All)</option>
            <option value="Unsold">Unsold</option>
            <option value="Hold">Hold</option>
          </select>

          {/* PLC Filter Dropdown */}
          <select
            value={filterPLC}
            onChange={(e) => setFilterPLC(e.target.value)}
            className="border rounded-lg shadow-sm mr-4 px-4 py-2"
          >
            <option value="All">PLC (All)</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={holdByMeFilter}
                onChange={() => setHoldByMeFilter(!holdByMeFilter)}
                className="h-4 w-4"
              />
              <span>Hold By Me</span>
            </label>
          </div>

        </div>

        {/* Search Input */}
        <div className="flex flex-wrap gap-4  lg:space-x-4">
          <input
            type="text"
            placeholder="Search project..."
            value={projectSearchTerm}
            onChange={(e) => setProjectSearchTerm(e.target.value)}
            className="border rounded-lg shadow-sm px-4 py-2"
          />

          <input
            type="text"
            placeholder="Search Unit or floor..."
            value={inventorySearchTerm}
            onChange={(e) => setInventorySearchTerm(e.target.value)}
            className="border rounded-lg shadow-sm px-4 py-2"
          />
        </div>
      </div>

      {/* Project Table */}
      {currentProjects.map((project) => (
        <div
          key={project.projectId}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl mb-8 overflow-y-hidden pb-8"
        >
          <h3 className="text-2xl text-center font-semibold lg:border-b mb-4 py-8">
            {project.projectName}
          </h3>
          {project.inventory.length > 0 ? (
            <div className="overflow-auto max-h-[100vh]">
            <table className="table-auto text-center  w-full mt-2">
              <thead className='sticky top-0 bg-white z-10'>
              <tr>
                <th className='px-2 py-2'>S No.</th>
                {visibleFields?.includes("areaSqYard") && <th className="px-4 py-2">AREA (Sq.Yard)</th>}
                {visibleFields?.includes("W") && <th className="px-4 py-2">W</th>}
                {visibleFields?.includes("L") && <th className="px-4 py-2">L</th>}
                {visibleFields?.includes("type") && <th className="px-4 py-2">Type</th>}
                {visibleFields?.includes("unitNumber") && <th className="px-4 py-2">Unit No.</th>}
                {visibleFields?.includes("floor") && <th className="px-4 py-2">Floor</th>}
                {visibleFields?.includes("carpetArea") && <th className="px-4 py-2">Carpet Area</th>}
                {visibleFields?.includes("balconyArea") && <th className="px-4 py-2">Balcony Area</th>}
                {visibleFields?.includes("terraceArea") && <th className="px-4 py-2">Terrace Area</th>}
                {visibleFields?.includes("stiltArea") && <th className="px-4 py-2">Stilt Area</th>}
                {visibleFields?.includes("basementArea") && <th className="px-4 py-2">Basement Area</th>}
                {visibleFields?.includes("mumty") && <th className="px-4 py-2">Mumty</th>}
                {visibleFields?.includes("commonArea") && <th className="px-4 py-2">Common Area</th>}
                {visibleFields?.includes("actualArea") && <th className="px-4 py-2">Actual Area</th>}
                {visibleFields?.includes("saleableArea") && <th className="px-4 py-2">Saleable Area</th>}
                {visibleFields?.includes("PLC") && <th className="px-4 py-2">PLC</th>}
                {visibleFields?.includes("plcCharges") && <th className="px-4 py-2">PLC Charges</th>}
                {visibleFields?.includes("status") && <th className="px-4 py-2">Status</th>}
                <th className="px-4 py-2"></th>
              </tr>

              </thead>
              <tbody>
                {project.inventory.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 py-2">{index}</td>
                    {visibleFields?.includes("areaSqYard") && <td className="px-4 py-2">{item.areaSqYard}</td>}
  {visibleFields?.includes("W") && <td className="px-4 py-2">{item.W}</td>}
  {visibleFields?.includes("L") && <td className="px-4 py-2">{item.L}</td>}
  {visibleFields?.includes("type") && <td className="px-4 py-2">{item.type}</td>}
  {visibleFields?.includes("unitNumber") && <td className="px-4 py-2">{item.unitNumber}</td>}
  {visibleFields?.includes("floor") && <td className="px-4 py-2">{item.floor}</td>}
  {visibleFields?.includes("carpetArea") && <td className="px-4 py-2">{item.carpetArea}</td>}
  {visibleFields?.includes("terraceArea") && <td className="px-4 py-2">{item.terraceArea}</td>}
  {visibleFields?.includes("stiltArea") && <td className="px-4 py-2">{item.stiltArea}</td>}
  {visibleFields?.includes("basementArea") && <td className="px-4 py-2">{item.basementArea}</td>}
  {visibleFields?.includes("mumty") && <td className="px-4 py-2">{item.mumty}</td>}
  {visibleFields?.includes("commonArea") && <td className="px-4 py-2">{item.commonArea}</td>}
  {visibleFields?.includes("actualArea") && <td className="px-4 py-2">{item.actualArea}</td>}
  {visibleFields?.includes("saleableArea") && <td className="px-4 py-2">{item.saleableArea}</td>}
  {visibleFields?.includes("PLC") && <td className="px-4 py-2">{item.PLC}</td>}
  {visibleFields?.includes("plcCharges") && <td className="px-4 py-2">{item.plcCharges}</td>}
                    <td
                      className={`px-4 py-2 font-semibold ${
                        item.status === "Sold"
                          ? "text-green-600"
                          : item.status === "Unsold"
                          ? "text-red-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleSellClick(item)}
                        className={`px-3 py-1 text-white rounded-lg font-semibold ${
                          item.status === "Hold" || item.status === "Sold"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={item.status === "Hold" || item.status === "Sold"}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>No inventory available for this project.</p>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <div className="flex justify-center mt-4">
            <button
              disabled={projectPage === 1}
              onClick={() => setProjectPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 text-2xl py-2 ${projectPage === 1 ? "text-gray-400" : "text-black"}`}
            >
              <RiArrowLeftSLine />
            </button>

            <button
              disabled={projectPage === totalPages}
              onClick={() => setProjectPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 text-2xl py-2 ${projectPage === totalPages ? "text-gray-400" : "text-black"}`}
            >
              <RiArrowRightSLine />
            </button>
          </div>
          <div className="flex justify-center mx-4">
            Page {projectPage} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
};


const userName = localStorage.getItem("userName") || "User";
const [fileNames, setFileNames] = useState({});

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return renderProjectsTable();
      case 'logout':
        return <h2 className="text-2xl font-bold">You have logged out.</h2>;
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
    className={`bg-[#F5F5DC] z-50 fixed lg:relative h-full transition-all duration-300 ${
      isSidebarOpen ? 'w-64 left-0' : '-left-64 w-0'
    } flex-shrink-0 top-0`}
  >
    <div className="flex border-b h-16 justify-between items-center px-4 py-4">
      <h1 className="text-gray-700 text-sm font-bold lg:text-xl">{userName}</h1>
      <button onClick={toggleSidebar} className="text-2xl text-gray-700">
      <img src="roflogo.svg" className="w-10" />
      </button>
    </div>

    {/* Sidebar Content */}
    <ul className="mt-4 px-4 space-y-2">
      <a href='/linkpage'>
                    <li
                      className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer `}
                    >
                      <p>Home</p><FaHome/>
                    </li>
                    </a>
      <li
        onClick={() => setActiveTab('projects')}
        className={`text-gray-600 hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${
          activeTab === 'projects' ? 'bg-gray-300' : ''
        }`}
      >
        Projects
      </li>
      <li
        onClick={handleLogout}
        className="rounded text-gray-600 cursor-pointer hover:bg-gray-300 px-2 py-2"
      >
        Logout
      </li>
    </ul>
  </div>

  {/* Always Visible Logo Button */}
  {!isSidebarOpen && (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
    >
      <img src="roflogo.svg" className="w-10" />
    </button>
  )}

      {/* Main Content */}
      <div
        className={`flex-grow  overflow-y-scroll  py-20 bg-[#FFFDD0] transition-all duration-300 ${isSidebarOpen ? 'lg:pl-8' : 'px-6 lg:px-0 lg:pl-16'}`}
      >
        <div className="p-4">{renderContent()}</div>
      </div>

      {/* Sell Form Modal */}
      {selectedItem && (
  <div className="flex bg-gray-700 bg-opacity-50 justify-center fixed inset-0 items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Sell Item: {selectedItem.unitNumber}</h2>
      <form onSubmit={handleSubmitForm}>
        <div className="mb-4">
          <label className="block mb-2">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleFormChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">PAN Card Image</label>
          <input
            type="file"
            name="panCardImage"
            onChange={handleFormChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
  <label className="block mb-2">Cheque Image</label>
  <div className="flex gap-2">
  <input
  type="file"
  name="chequeImage"
  accept="image/*"
  onChange={handleFormChange}
  className="border border-gray-300 p-2 rounded w-full"
  required={!isChequeImageFilled} // Required only if no file is selected
/>

    <button
      type="button"
      onClick={() => {
        const fileInput = document.getElementById("chequeCapture");
        if (fileInput) {
          fileInput.value = ""; // Reset the field before capturing
          fileInput.click();
        }
      }}
      className="bg-blue-500 text-white px-3 py-2 rounded"
    >
      Capture
    </button>
  </div>

  {/* Hidden Camera Capture Input */}
  <input
    type="file"
    id="chequeCapture"
    name="chequeImage"
    accept="image/*"
    capture="environment"
    onChange={handleFormChange}
    className="hidden"
  />

  {/* Display Selected File Name */}
  {fileNames.chequeImage && (
    <p className="mt-2 text-sm text-gray-600">
      Selected File: <span className="font-bold">{fileNames.chequeImage}</span>
    </p>
  )}
</div>

        <div className="flex justify-end">
          <button type="submit" className="bg-green-500 rounded text-white px-4 py-2">
            Place on Hold
          </button>
        </div>
      </form>
      <button onClick={() => setSelectedItem(null)} className="bg-red-500 rounded text-white mt-4 px-4 py-2">
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default ProjectList;








