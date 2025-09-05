import React, { useState, useEffect, useRef } from 'react';
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
import { RxCross2 } from "react-icons/rx";
import { FaCircleCheck } from "react-icons/fa6";
import { BsFillXCircleFill } from "react-icons/bs";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,Filler, Title, Tooltip, Legend } from 'chart.js';
import { ChevronDown, Building2, CheckCircle2, CircleX, Clock, ArrowRight, Home, User, LogOut, X } from "lucide-react";
import BrokerDetails from './BrokerDetails';
import SaleForm from './SaleForm';
import { FiActivity, FiEdit, FiPlus, FiSave, FiTrash } from 'react-icons/fi';
import RequestEditForm from './RequestEditForm';
import { PaymentForm } from './PaymentForm';
import UserActivity from './UserActivity';
import ReactSelect from 'react-select';
import CustomSelect from './CustomSelect';
import ProjectSelectDropdown from './ProjectSelectDropdown';

ChartJS.register(CategoryScale, LinearScale, PointElement,Filler, LineElement, Title, Tooltip, Legend);


// Initialize the WebSocket connection
const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

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
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showPendingBrokerageOnly, setShowPendingBrokerageOnly] = useState('all');
  const [download, setDownload] = useState(false);
  const [brokerDetails, setBrokerDetails] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [role, setRole] = useState(''); // State to track selected role
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const tabsRef = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update the role state on change
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  const navigate = useNavigate(); // To handle navigation

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!socket) return;
  
    // Listener for new hold requests
    const handleNewHoldRequest = (newRequest) => {
      console.log('New hold request received:', newRequest);
      
      // Update saleRequests state immediately
      setSaleRequests(prev => {
    // Ensure inventoryId is properly structured
    const updatedRequest = {
      ...newRequest,
      inventoryId: newRequest.inventoryDetails 
        ? { 
            ...newRequest.inventoryDetails,
            _id: newRequest.inventoryId,
            customerName: newRequest.customerName
          }
        : newRequest.inventoryId
    };
    
    return {
      ...prev,
      pending: [updatedRequest, ...prev.pending]
    };
  });
  
     
      
      // Update inventory status in real-time
      setProjectInventories(prevInventories => 
        prevInventories.map(project => ({
          ...project,
          inventory: project.inventory.map(item => 
            item._id === newRequest.inventoryId 
              ? { ...item, status: 'Hold' } 
              : item
          )
        }))
      );
    };
  
    // Listener for general request updates
    const handleRequestUpdated = (updatedRequest) => {
      setSaleRequests(prev => {
        const updatedRequests = { ...prev };
        let found = false;
  
        Object.keys(updatedRequests).forEach(category => {
          updatedRequests[category] = updatedRequests[category].map(req => {
            if (req._id === updatedRequest.requestId) {
              found = true;
              return { ...req, ...updatedRequest };
            }
            return req;
          });
        });
  
        if (!found && updatedRequest.status === 'Pending') {
          updatedRequests.pending = [updatedRequest, ...updatedRequests.pending];
        }
  
        return updatedRequests;
      });
    };
  
    socket.on('newHoldRequest', handleNewHoldRequest);
    socket.on('requestUpdated', handleRequestUpdated);
  
    return () => {
      socket.off('newHoldRequest', handleNewHoldRequest);
      socket.off('requestUpdated', handleRequestUpdated);
    };
  }, [socket]);
  // Add this to your socket listeners
  useEffect(() => {
    if (!socket) return;
  
    const handleInventoryStatusUpdate = ({ inventoryId, status }) => {
      setProjectInventories(prev => 
        prev.map(project => ({
          ...project,
          inventory: project.inventory.map(item => 
            item._id === inventoryId ? { ...item, status } : item
          )
        }))
      );
    };
  
    socket.on('inventoryStatusUpdated', handleInventoryStatusUpdate);
  
    return () => {
      socket.off('inventoryStatusUpdated', handleInventoryStatusUpdate);
    };
  }, [socket]);
  // Make sure socket is part of the dependency array





  // Fetch all project inventories
  useEffect(() => {
    if (activeTab === 'projects' || activeTab === 'dashboard' || activeTab === 'createExecutive' || activeTab === 'users') {
      const fetchInventories = async () => {
        setLoading(true);
        setError(null);
        try {
          // Check if the data is cached
          const cachedData = localStorage.getItem('projectInventories');
          let projectInventories = cachedData ? JSON.parse(cachedData) : [];
          
          // If cached data exists, don't make the API request (initial load, else re-fetch when required)
          if (cachedData) {
            console.log('Using cached project inventories');
            setProjectInventories(projectInventories);
          }
          
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');
          
          // Make the API request if the data isn't cached or if something has changed
          const response = await fetch(`${API_BASE_URL}/api/project/inventories`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) throw new Error('Failed to fetch inventories');
          
          const data = await response.json();
          projectInventories = data.projectInventories || [];
  
          // Update the state and cache only if the new data is different from the cached data
          if (JSON.stringify(projectInventories) !== cachedData) {
            console.log('New inventories fetched, updating cache');
            setProjectInventories(projectInventories);
            localStorage.setItem('projectInventories', JSON.stringify(projectInventories)); // Update cache
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchInventories();
    }
  
    if (activeTab === 'projects' || activeTab === 'requests' || activeTab === 'dashboard') {
      const fetchSaleRequests = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');
          
          const response = await fetch(`${API_BASE_URL}/api/project/request`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) throw new Error('Failed to fetch sale requests');
          
          const data = await response.json();
          const saleRequests = data.saleRequests || [];
  
          console.log("Sale requests data:", saleRequests);
          setHasPendingRequests(saleRequests.some(request => request.status === 'Pending'));
  
          const pending = saleRequests.filter(request => request.status === 'Pending');
          const approved = saleRequests.filter(request => request.status === 'Approved');
          const rejected = saleRequests.filter(request => request.status === 'Rejected');
          setSaleRequests({ pending, approved, rejected });
  
          // Check if the inventory status needs to be updated
          if (pending.length > 0) {
            // Update the inventory status in the projectInventories state
            setProjectInventories((prevInventories) => {
              return prevInventories.map((project) => {
                project.inventory = project.inventory.map((inv) => {
                  const pendingRequest = pending.find((request) => request.inventoryId._id === inv._id);
                  if (pendingRequest) {
                    return { ...inv, status: 'Hold' }; // Change status to "Hold" if pending request exists
                  }
                  return inv;
                });
                return project;
              });
            });
            // Update the cache after changing the status
            localStorage.setItem('projectInventories', JSON.stringify(projectInventories));
          }
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
  const requestItemsPerPage = 10; // Number of requests per page
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    executiveName: "",
    basePrice: '',
    customerName: "",
    panCardImagePath: "",
    chequeImagePath: "",
    customerInfo: {
      guardianName: "",
      age: "",
      nationality: "",
      panNumber: "",
      aadharCardNumber: "",
      occupation: "",
      residentStatus: "",
      address: "",
      state: "",
      country: "",
      pin: "",
      email: "",
      contactNumber: "",
    },
    unitDetails: {
      unitType: "",
      unitCost: "",
      otherCharges: "",
    },
    paymentDetails: [
      {
        chequeNumber: "",
        date: "",
        amount: "",
        bankName: "",
      },
    ],
  });
  const [selectedBroker, setSelectedBroker] = useState("");
  const [saleRequestId, setSaleRequestId] = useState(null); // New state to hold requestId
  const [showSaleEditForm, setShowSaleEditForm] = useState(false);

  const handleEditClick = (requestId) => {
    setSaleRequestId(requestId);  // Store the requestId when edit is clicked
    setShowSaleEditForm(true);    // Show the form
  };
  const [isOpen, setIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
  const [newPayment, setNewPayment] = useState({
    chequeNumber: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    bankName: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_BASE_URL}/api/project/request`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Fetched Data:", data);

          // Check if saleRequests exists and has items
          if (Array.isArray(data.saleRequests)) {
            // Find the specific request you want or use the first one
            const requestWithPayments = data.saleRequests.find(
              request => Array.isArray(request.paymentDetails) && request.paymentDetails.length > 0
            );

            if (requestWithPayments) {
              setPaymentDetails(requestWithPayments.paymentDetails);
              console.log("payment details", paymentDetails)
            } else {
              console.log("No requests with payment details found");
              setPaymentDetails([]); // Set empty array if no payments found
            }
          } else {
            console.error("saleRequests is not an array");
            setPaymentDetails([]);
          }
        } catch (error) {
          console.error("Error fetching sale requests:", error.message);
          setPaymentDetails([]);
        }
      };

      fetchData();
    }
  }, [isOpen]);
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState('');
  const [chequeStatusFilter, setChequeStatusFilter] = useState('all'); // 'all', 'pending', 'cleared'
  useEffect(() => {
    setRequestPage(1); // Reset to first page when filters change
  }, [selectedCategory, selectedBrokerFilter, chequeStatusFilter, requestSearchTerm, showPendingBrokerageOnly]);

  const categories = ['Pending', 'Approved', 'Rejected']; // Possible categories
  useEffect(() => {
  const index = categories.indexOf(selectedCategory);
  const currentTab = tabsRef.current[index];

  if (currentTab) {
    const { offsetLeft, clientWidth } = currentTab;

    setIndicatorStyle(prev => {
      if (prev.left === offsetLeft && prev.width === clientWidth) {
        return prev; // No change, avoid re-render
      }
      return { left: offsetLeft, width: clientWidth };
    });
  }
}, [selectedCategory, categories]);







  const renderRequestsTable = () => {
    
    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      setRequestPage(1); // Reset to page 1 when changing category
    };
    
    const handleApproveClick = (request) => {
      const updatedUnitDetails = { ...request.unitDetails };

      // Remove unitType explicitly
      delete updatedUnitDetails.unitType;
      setSelectedRequest(request);
      setCustomerDetails({
        executiveName: request.createdBy?.name || "No Executive",
        customerName: request.inventoryId.customerName || "",
        panCardImagePath: request.inventoryId.panCardImagePath || "",
        chequeImagePath: request.inventoryId.chequeImagePath || "",
        basePrice: '',
        customerInfo: request.customerInfo || {
          guardianName: "",


          panNumber: "",
          aadharCardNumber: "",
          address: "",
          state: "",
          country: "",
          pin: "",
          email: "",
          contactNumber: "",
        },
        unitDetails: request.unitDetails || {

          unitCost: "",
        },
        paymentDetails: request.paymentDetails?.length > 0 ? request.paymentDetails : [{
          chequeNumber: "",
          date: "",
          amount: "",
          bankName: "",
        }],

      });
      setShowApprovalForm(true);
    };

    const handleFormSubmit = async (e, requestId) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_BASE_URL}/api/project/requests/${requestId}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...customerDetails, // Include customer details
            mainBroker: selectedBroker?.value || null,
            action: "approve",  // Explicitly send action field
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSaleRequests(prev => {
            const updated = { ...prev };

            // Remove from all categories
            Object.keys(updated).forEach(category => {
              updated[category] = updated[category].filter(req => req._id !== requestId);
            });

            // Add to approved with correct status
            updated.approved = [
              ...updated.approved,
              {
                ...data.saleRequest,
                inventoryId: data.inventoryItem,
                status: 'Approved' // Explicitly set status
              }
            ];

            return updated;
          });
          setShowApprovalForm(false);
          console.log("Sale request approved successfully");
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error approving request:", error);
      }
    };

    const handleAction = async (requestId, action) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/project/requests/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }), // Send the action (approve or reject)
        });

        const data = await response.json();
        if (data.success) {
          setSaleRequests(prevRequests => {
            const updatedRequests = { ...prevRequests };

            // Remove from all categories first
            Object.keys(updatedRequests).forEach(category => {
              updatedRequests[category] = updatedRequests[category].filter(req => req._id !== requestId);
            });

            // Determine the new category based on the action
            const newCategory = action === 'approve' ? 'approved' :
              action === 'reject' ? 'rejected' :
                'pending';

            // Add to the correct category
            updatedRequests[newCategory] = [
              ...(updatedRequests[newCategory] || []),
              {
                ...data.saleRequest,
                inventoryId: data.inventoryItem,
                status: action === 'approve' ? 'Approved' :
                  action === 'reject' ? 'Rejected' :
                    'Pending'
              }
            ];

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
    const handleDownload = async () => {
      setBrokerDetails(true);
      try {
        let url = `${API_BASE_URL}/api/project/requests/approved/download`;

        // If you want to download only for a specific broker (userId), add it as a query param
        if (selectedBrokerFilter) {
          url += `?userId=${selectedBrokerFilter}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `approved_requests_${selectedUserId || 'all'}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setBrokerDetails(false);
      }
    };

    const handleDownloadPaymentDetails = async (saleRequestId) => {
      const clearedCheques = paymentDetails.filter(p => p.isChequeCleared);

      if (clearedCheques.length === 0) {
        alert("Cannot generate invoice – no cheques are cleared.");
        return;
      }

      setDownload(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/project/requests/${saleRequestId}/payment/download`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Replace with actual token if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment_details_${saleRequestId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setDownload(false);
      }
    };

    const handleOpenPaymentModal = async (request) => {
      setCurrentRequest(request);
      // Ensure we always have an array and format dates properly
      setPaymentDetails((request.paymentDetails || []).map(p => ({
        ...p,
        date: p.date ? p.date.split('T')[0] : '', // Format for date inputs
        nextPaymentDate: p.nextPaymentDate ? p.nextPaymentDate.split('T')[0] : ''
      })));
      setIsPaymentModalOpen(true);
    };
    const updateRequestInCategory = (updatedRequest) => {
      setSaleRequests(prev => {
        const categoryKey = Object.keys(prev).find(key =>
          prev[key].some(req => req._id === updatedRequest._id)
        );

        if (!categoryKey) return prev;

        return {
          ...prev,
          [categoryKey]: prev[categoryKey].map(request =>
            request._id === updatedRequest._id ? updatedRequest : request
          )
        };
      });
    };

    const handleAddPayment = async (newPayment) => {
      try {
        const token = localStorage.getItem("token");

        const paymentToAdd = {
          ...newPayment,
          date: newPayment.date ? new Date(newPayment.date).toISOString() : null,
          nextPaymentDate: newPayment.nextPaymentDate ? new Date(newPayment.nextPaymentDate).toISOString() : null
        };

        const response = await fetch(
          `${API_BASE_URL}/api/project/requests/${currentRequest._id}/payment`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentDetails: [paymentToAdd]
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add payment');
        }

        const data = await response.json();

        const formattedPayments = data.updatedPayments.map(p => ({
          ...p,
          date: p.date ? p.date.split('T')[0] : '',
          nextPaymentDate: p.nextPaymentDate ? p.nextPaymentDate.split('T')[0] : ''
        }));

        setPaymentDetails(formattedPayments);

        // Update parent state if updateRequestInCategory exists
        if (typeof updateRequestInCategory === 'function') {
          updateRequestInCategory({
            ...currentRequest,
            paymentDetails: formattedPayments
          });
        }

        setNewPayment({
          chequeNumber: '',
          date: new Date().toISOString().split('T')[0],
          amount: '',
          bankName: '',
          percentagePaid: 0,
          nextPaymentDate: '',
          remarks: '',
          isChequeCleared: false
        });

      } catch (error) {
        console.error("Error adding payment:", error);
        alert(`Failed to add payment: ${error.message}`);
      }
    };

    const handleUpdatePayment = async (index, updatedPayment) => {
      try {
        const paymentId = paymentDetails[index]._id;
        const token = localStorage.getItem("token");

        const paymentToUpdate = {
          ...updatedPayment,
          date: updatedPayment.date ? new Date(updatedPayment.date).toISOString() : null,
          nextPaymentDate: updatedPayment.nextPaymentDate ? new Date(updatedPayment.nextPaymentDate).toISOString() : null
        };

        const response = await fetch(
          `${API_BASE_URL}/api/project/${currentRequest._id}/payments/${paymentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(paymentToUpdate)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update payment');
        }

        const data = await response.json();

        const updatedPaymentData = {
          ...data.updatedPayment,
          date: data.updatedPayment.date ? data.updatedPayment.date.split('T')[0] : '',
          nextPaymentDate: data.updatedPayment.nextPaymentDate ? data.updatedPayment.nextPaymentDate.split('T')[0] : ''
        };

        const updatedPayments = [...paymentDetails];
        updatedPayments[index] = updatedPaymentData;
        setPaymentDetails(updatedPayments);
        setEditingPaymentIndex(null);

        // Update parent state if updateRequestInCategory exists
        if (typeof updateRequestInCategory === 'function') {
          updateRequestInCategory({
            ...currentRequest,
            paymentDetails: updatedPayments
          });
        }

      } catch (error) {
        console.error("Error updating payment:", error);
        alert(`Update failed: ${error.message}`);
      }
    };
    const handleDeletePayment = async (requestId, paymentId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/project/requests/${requestId}/deletepayments/${paymentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete payment');
        }

        // Update the frontend state to remove the deleted payment
        setPaymentDetails(prev => prev.filter(payment => payment._id !== paymentId));
        if (typeof updateRequestInCategory === 'function') {
          updateRequestInCategory({
            ...currentRequest,
            paymentDetails: paymentDetails.filter(p => p._id !== paymentId)
          });
        }

        alert("Payment deleted successfully");
      } catch (error) {
        console.error("Error deleting payment:", error);
        alert(`Delete failed: ${error.message}`);
      }
    };








    const renderTable = (category) => {
      const requests = saleRequests[category.toLowerCase()] || [];


      // Apply search filter
      const filteredRequests = requests.filter((request) => {
        const customerName = request.customerName || request.inventoryId?.customerName || '';
        const unitNumber = request.inventoryId?.unitNumber;
        const matchesSearch = customerName.toLowerCase().includes(requestSearchTerm.toLowerCase()) || unitNumber.toLowerCase().includes(requestSearchTerm.toLowerCase());

        // Broker filter
        const matchesBroker = !selectedBrokerFilter || request.createdBy?._id === selectedBrokerFilter;

        // Cheque status filter (only for Approved tab)
        let matchesChequeStatus = true;
        if (category === 'Approved' && chequeStatusFilter !== 'all') {
          const hasPendingCheques = request.paymentDetails?.some(payment => !payment.isChequeCleared);
          matchesChequeStatus = chequeStatusFilter === 'pending'
            ? hasPendingCheques
            : !hasPendingCheques;
        }

        // Brokerage status filter
        const totalPercentagePaid = (request.paymentDetails || [])
          .filter(payment => payment.isChequeCleared)
          .reduce(
            (total, payment) => total + (Number(payment.percentagePaid) || 0),
            0
          );

        const isPendingBrokerage = !request.brokerageDetails?.isBrokerageComplete;
        const isPaidBrokerage = request.brokerageDetails?.isBrokerageComplete;
        const isBbaPaid = request.brokerageDetails.bba === true;

        let matchesBrokerageStatus = true;
        if (category === 'Approved') {
          if (showPendingBrokerageOnly === 'pending') {
            matchesBrokerageStatus = totalPercentagePaid >= 40 && isBbaPaid && isPendingBrokerage;
          } else if (showPendingBrokerageOnly === 'paid') {
            matchesBrokerageStatus = isPaidBrokerage;
          }
        }

        return matchesSearch && matchesBroker && matchesChequeStatus && matchesBrokerageStatus;
      });



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
      const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(dateString));
      };
      const updateRequestInCategory = (updatedRequest) => {
        setSaleRequests(prev => {
          // Find which category the request belongs to
          const categoryKey = Object.keys(prev).find(key =>
            prev[key].some(req => req._id === updatedRequest._id)
          );

          if (!categoryKey) return prev;

          return {
            ...prev,
            [categoryKey]: prev[categoryKey].map(request => {
              if (request._id === updatedRequest._id) {
                // Find the existing request to preserve broker objects
                const existingRequest = prev[categoryKey].find(r => r._id === updatedRequest._id);

                return {
                  ...updatedRequest, // New data from API
                  // Preserve the full broker objects if they exist
                  inventoryId: existingRequest?.inventoryId || request.inventoryId,
                  createdBy: existingRequest?.createdBy || updatedRequest.createdBy,
                  mainBroker: updatedRequest.mainBroker || existingRequest?.mainBroker,
                };
              }
              return request;
            })
          };
        });
      };




      return (
        <>
          {currentRequests.length > 0 ? (

            <table className="table-auto bg-white border border-b-gray-950 border-collapse rounded-md shadow-xl text-center w-full mt-2 ">
              <thead className="border border-b-gray-950">
                <tr>
                  <th className="px-4 py-2">Broker</th>
                  {category === 'Approved' && <th className="px-4 py-2">Main Broker</th>}
                  {category === 'Approved' && <th className="px-4 py-2">Brokerage</th>}
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Floor</th>
                  <th className="px-4 py-2">Status</th>
                  {category === 'Pending' && <th className="px-4 py-2">Created At</th>}
                  {category === 'Approved' && <th className="px-4 py-2">Paid %</th>}
                  {category === 'Approved' && <th className="px-4 py-2">BBA</th>}
                  {category === 'Approved' && <th className="px-4 py-2">Cheques</th>}
                  {category === 'Approved' && <th className="px-4 py-2">Edit Payment</th>}
                  {category === 'Pending' && <th className="px-4 py-2">Actions</th>}
                  <th className="text-center px-4 py-2">Download</th>

                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => {

                  const totalPercentage = request.paymentDetails?.reduce(
                    (total, payment) => total + (Number(payment.percentagePaid) || 0),
                    0
                  );


                  const pendingCheques = request.paymentDetails?.filter(
                    payment => !payment.isChequeCleared
                  ).length || 0;
                  return (
                    <tr className='text-sm' key={request._id}>
                      <td className="px-4 py-4">{typeof request.createdBy === 'object'
                        ? request.createdBy.name
                        : users.find(u => u._id === request.createdBy)?.name || 'Loading...'}</td>
                      {request.status === 'Approved' && 
                         (
                         <td className="px-4 py-4">{request?.mainBroker?.name || 'Not Selected'}</td>
                         )
                         }
                      {request.status === 'Approved' && (
                        <td className="px-4 py-4">
                          {(() => {
                            const paymentDetails = request.paymentDetails || [];
                            const totalPercentagePaid = paymentDetails
                              .filter(payment => payment.isChequeCleared)
                              .reduce((total, payment) => total + (Number(payment.percentagePaid) || 0), 0);


                            const isBbaPaid = request.brokerageDetails?.bba;
                            const isBrokerageComplete = request.brokerageDetails?.isBrokerageComplete;

                            if (isBrokerageComplete) {
                              return <span className="text-blue-600 font-semibold">Paid</span>;
                            } else if (totalPercentagePaid >= 40 && isBbaPaid) {
                              return <span className="text-green-600 font-semibold">Due</span>;
                            } else if (totalPercentagePaid >= 40 && isBbaPaid && !isBrokerageComplete) {
                              return <span className="text-yellow-600 font-semibold">Not Paid</span>;
                            } else {
                              return <span className="text-red-500 font-medium">Not Due</span>;
                            }
                          })()}
                        </td>

                      )}


                      <td className="px-4 py-4">{request.customerName || request.inventoryId?.customerName || 'No Customer'}</td>

                      <td className="px-4 py-4">{request.inventoryId.unitNumber || 'No Unit '}</td>
                      <td className="px-4 py-4">{request.inventoryId.floor || 'No Floor '}</td>
                      <td className="px-4 py-4">{request.status}</td>
                      {request.status === 'Approved' && (
                        <td className="px-4 py-4 text-center font-semibold">
                          {(() => {
                            const paymentDetails = request.paymentDetails || [];

                            const clearedPayments = paymentDetails.filter(
                              (payment) => payment.isChequeCleared === true
                            );

                            const totalPercentage = clearedPayments.reduce(
                              (total, payment) => total + (Number(payment.percentagePaid) || 0),
                              0
                            );

                            return (
                              <span
                                className={`px-2 py-1 rounded-lg text-white ${totalPercentage >= 100
                                  ? 'bg-green-500'
                                  : totalPercentage >= 40
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                  }`}
                              >
                                {totalPercentage}%
                              </span>
                            );
                          })()}
                        </td>
                      )}

                      {request.status === 'Approved' && (
                        <td className={`px-4 text-xl text-center py-4 ${request.brokerageDetails?.bba ? "text-green-500" : "text-red-600"}`}>{request.brokerageDetails?.bba ? <div className="flex justify-center">
                          <FaCircleCheck />
                        </div> : <div className="flex justify-center">
                         <BsFillXCircleFill/>
                        </div>}</td>
                      )}
                      

                      {request.status === 'Approved' && (
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${pendingCheques > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                            {pendingCheques} pending
                          </span>
                        </td>
                      )}
                      {request.status === 'Approved' && (
                        <td
                          onClick={() => handleOpenPaymentModal(request)}
                          className="px-4 py-4 cursor-pointer  text-center"
                        >

                          <div className="flex justify-center">
                            <FiEdit />
                          </div>
                        </td>
                      )}
                      {request.status === 'Pending' && (
                        <td className="px-4 py-4 text-center cursor-pointer">
                          {new Date(request.createdAt).toLocaleString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </td>
                      )}


                      {request.status === 'Pending' && (
                        <td className="text-center px-4 py-4">
                          <button
                            onClick={() => handleApproveClick(request)}
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
                      {request.status === 'Pending' && (
                        <td className="px-3 py-4 flex flex-col">
                          <a
                            href={`${API_BASE_URL}/${request.inventoryId?.chequeImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >
                            Cheque
                          </a>
                          <a
                            href={`${API_BASE_URL}/${request.inventoryId?.panCardImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >

                            Pan Card

                          </a>
                        </td>
                      )}

                      {request.status === 'Approved' && (
                        <td className="px-3 py-4 flex flex-col">
                          <a
                            href={`${API_BASE_URL}/${request.chequeImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >
                            Cheque
                          </a>
                          <a
                            href={`${API_BASE_URL}/${request.panCardImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >

                            Pan Card

                          </a>
                        </td>
                      )}
                      {request.status === 'Rejected' && (
                        <td className="px-3 py-4 flex flex-col">
                          <a
                            href={`${API_BASE_URL}/${request.chequeImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >
                            Cheque
                          </a>
                          <a
                            href={`${API_BASE_URL}/${request.panCardImagePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-blue-800 hover:text-blue-500'
                          >

                            Pan Card

                          </a>
                        </td>
                      )}
                      {request.status === 'Approved' && <td onClick={() => handleEditClick(request._id)} className="px-4 py-4 cursor-pointer"><FiEdit /></td>
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-10 py-10">No {category.toLowerCase()} requests.</p>
          )}

          {showSaleEditForm && <RequestEditForm onUpdate={updateRequestInCategory} requestId={saleRequestId} closeForm={() => setShowSaleEditForm(false)} />}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white px-6 pb-6 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between pt-6 items-center sticky top-0 z-10 bg-white mb-4">
                  <h2 className="text-xl font-semibold">
                    Payment Details for {currentRequest?.inventoryId?.customerName || 'Customer'}
                  </h2>


                  <button
                    onClick={() => {

                      setIsPaymentModalOpen(false);
                      setEditingPaymentIndex(null);
                    }}
                    className="text-red-500 font-bold text-xl"
                  >
                    <RxCross2 />
                  </button>
                </div>

                {/* Existing Payments */}
                <div className="mb-6">
                  <div className='flex relative w-full mb-2 justify-between items-center'>
                    <h3 className="text-lg font-medium ">Existing Payments</h3>
                    <p className=''>Base Price : {currentRequest?.basePrice}</p>
                    <button disabled={download} onClick={() => handleDownloadPaymentDetails(currentRequest?._id)} className='px-2 py-1 font-semibold bg-yellow-500 rounded-lg'>
                      {download ? "Creating Invoice..." : "Download Invoice"}
                    </button>
                  </div>
                  {paymentDetails.length === 0 ? (
                    <p className="text-gray-500">No payment records found</p>
                  ) : (
                    <div className="space-y-3 relative">
                      <div className="mb-2  text-sm font-semibold text-green-600">
                        Total Percentage Paid:{" "}
                        {paymentDetails
                          .filter((payment) => payment.isChequeCleared)
                          .reduce((total, payment) => total + (Number(payment.percentagePaid) || 0), 0)}%

                      </div>
                      {paymentDetails.map((payment, index) => (
                        <div key={payment._id || index} className="border p-3 rounded-lg relative">
                          {editingPaymentIndex === index ? (
                            <PaymentForm
                              payment={payment}
                              onSave={(updatedPayment) => handleUpdatePayment(index, updatedPayment)}
                              onCancel={() => setEditingPaymentIndex(null)}
                            />
                          ) : (
                            <>
                              <div className="grid grid-cols-4 gap-2 relative">
                                <div>
                                  <p className="text-sm font-medium">Cheque/UTR No:</p>
                                  <p>{payment.chequeNumber || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Amount:</p>
                                  <p>{payment.amount || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Bank:</p>
                                  <p>{payment.bankName || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Date:</p>
                                  <p>{payment.date ? formatDate(payment.date) : '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Payment Status</p>
                                  <p>{payment.isChequeCleared ? "Cleared" : 'Not Cleared'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Next Date:</p>
                                  <p>{payment.nextPaymentDate ? formatDate(payment.nextPaymentDate) : '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Payment Percentage:</p>
                                  <p>{payment.percentagePaid || '-'}</p>
                                </div>

                              </div>
                              <div className='mt-2 w-full'>
                                <p className="text-sm font-medium">Remarks:</p>
                                <p>{payment.remarks || '-'}</p>
                              </div>
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => setEditingPaymentIndex(index)} className="text-blue-500">
                                  <FiEdit />
                                </button>
                                <button onClick={() => handleDeletePayment(currentRequest._id, payment._id)} className="text-red-500">
                                  <FiTrash />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Payment */}
                <div className="mt-6">
                  <h3 className="text-xl font-medium mb-2">Add New Payment</h3>
                  <PaymentForm
                    payment={newPayment}
                    onSave={handleAddPayment}
                    onCancel={() => setNewPayment({
                      chequeNumber: '',
                      date: new Date().toISOString().split('T')[0],
                      amount: '',
                      bankName: ''
                    })



                    }
                  />
                </div>
              </div>
            </div>
          )}


          {showApprovalForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
              <form
                onSubmit={(e) => handleFormSubmit(e, selectedRequest._id)}
                className="bg-gray-300 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto"
              >
                <h2 className="text-lg font-bold mb-4">Approve Sale Request</h2>

                {/* Customer Details */}
                <label className="block mb-2">
                  Customer Name:
                  <input
                    type="text"
                    value={customerDetails.customerName}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, customerName: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Base Price:
                  <input
                    type="number"
                    value={customerDetails.basePrice || ''}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, basePrice: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </label>

                {/* Prefilled Images */}
                {/* <div className="flex space-x-4">
                  <div>
                    <label className="block mb-2">Pan Card:</label>
                    <img
                      src={`${API_BASE_URL}/${customerDetails.panCardImagePath}`}
                      alt="Pan Card"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Cheque:</label>
                    <img
                      src={`${API_BASE_URL}/${customerDetails.chequeImagePath}`}
                      alt="Cheque"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                </div> */}

                {/* Customer Info */}
                <div className='flex flex-row flex-wrap justify-between items-center'>
                  {Object.keys(customerDetails.customerInfo).map((field) => (
                    <div key={field} className={`${field === "contactNumber" ? "w-full" : "w-[48%]"} `}>
                      <label className="block mb-2" key={field}>
                        {field === "guardianName"
                          ? "Father Name" // Update label here
                          : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}:
                        <input
                          type={field === "dateOfBirth" ? "date" : field === "age" || field === "pin" ? "number" : "text"}
                          value={customerDetails.customerInfo[field] || ""}
                          onChange={(e) =>
                            setCustomerDetails({
                              ...customerDetails,
                              customerInfo: { ...customerDetails.customerInfo, [field]: e.target.value },
                            })
                          }
                          className="w-full border p-2 rounded"
                        />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Unit Details */}
                <div className='flex flex-row justify-between items-center'>
                  {Object.keys(customerDetails.unitDetails)
                    .filter((field) => field.toLowerCase() !== "unitType")
                    .map((field) => (
                      <div key={field} className={`w-full`}>
                        <label className="block mb-2" >
                          {field === "date"
                            ? "Cheque Date" // Update label here
                            : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}:
                          <input
                            type={field === "unitCost" || field === "otherCharges" ? "number" : "text"}
                            value={customerDetails.unitDetails[field] || ""}
                            onChange={(e) =>
                              setCustomerDetails({
                                ...customerDetails,
                                unitDetails: { ...customerDetails.unitDetails, [field]: e.target.value },
                              })
                            }
                            className="w-full border p-2 rounded"
                          />

                        </label>
                      </div>
                    ))}
                </div>

                <label className="block mb-2">
                  Broker Name:
                  <input
                    type="text"
                    value={customerDetails.executiveName}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-200"
                  />
                </label>
                {/* <label className="block mb-2">
                  Main Broker:
                  <ReactSelect
  options={brokerOptions}
  value={selectedBroker}
  onChange={(option) => {
    console.log("Broker selected:", option); // 👈 Check this logs the full object
    setSelectedBroker(option);
  }}
  className="w-full"
/>

                </label> */}



                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowApprovalForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Approve
                  </button>
                </div>
              </form>
            </div>
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
    const brokerOptions = [
      { value: "", label: "All Brokers" },
      ...users.map((user) => ({ value: user._id, label: user.name })),
    ];
    
    const selectedBroker = brokerOptions.find(
      (option) => option.value === selectedBrokerFilter
    );

    return (
      <div className="space-y-4">
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-300 p-1 shadow-sm">
      {/* Sliding Indicator */}
      <div
        className="absolute top-1 z-10 rounded-md bg-white shadow-md transition-all duration-300 ease-out"
        style={{
          ...indicatorStyle,
          height: "calc(100% - 8px)",
        }}
      />

      {/* Category Buttons */}
      <div className="relative z-20 flex w-full">
        {categories.map((category, index) => (
          <button
            key={category}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => handleCategoryChange(category)}
            className={`flex-1 rounded-md px-4 py-2.5 text-center text-sm font-medium transition-colors duration-200
              ${selectedCategory === category ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-4 gap-4">
          {selectedCategory === "Approved" && (selectedBrokerFilter || chequeStatusFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedBrokerFilter('');
                setChequeStatusFilter('all');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 ml-2"
            >
              Clear All Filters
            </button>
          )}
          {selectedCategory === "Approved" && (
            <ReactSelect
            value={selectedBroker}
            onChange={(selectedOption) => setSelectedBrokerFilter(selectedOption?.value || "")}
            options={brokerOptions}
            className="w-full max-w-[10rem]"
            styles={{
              menuList: (provided) => ({
                ...provided,
                maxHeight: '15rem',
                overflowY: 'auto',
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 'none', // remove outer maxHeight to avoid double scroll
              }),
            }}
          />
          
          )}

          {selectedCategory === "Approved" && (
            <ReactSelect
              value={{
                label:
                  chequeStatusFilter === "pending"
                    ? "Not Cleared"
                    : chequeStatusFilter === "cleared"
                    ? "Cleared"
                    : "All Payment",
                value: chequeStatusFilter,
              }}
              onChange={(selectedOption) =>
                setChequeStatusFilter(selectedOption?.value || "all")
              }
              options={[
                { label: "All Payment", value: "all" },
                { label: "Not Cleared", value: "pending" },
                { label: "Cleared", value: "cleared" },
              ]}
              className=" max-w-xs"
              styles={{
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "10rem",
                  overflowY: "auto",
                }),
              }}
            />
          )}


          {selectedCategory === "Approved" && (
            // 

            <button
              onClick={handleDownload}
              className="px-4 py-2 font-semibold bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
              disabled={brokerDetails}
            >
              {brokerDetails ? "Creating Excel..." : "Broker Details"}
            </button>
          )}

          {selectedCategory === "Approved" && (
            <select
              value={showPendingBrokerageOnly}
              onChange={(e) => setShowPendingBrokerageOnly(e.target.value)}
              className="border rounded-lg shadow-sm px-4 py-2"
            >
              <option value="all">All Brokerage</option>
              <option value="pending">Pending Brokerage (≥ 40%)</option>
              <option value="paid">Paid Brokerage</option>
            </select>
          )}



          <input
            type="text"
            placeholder="Search Unit Or Customer..."
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
  const [selectedInventoryForSale, setSelectedInventoryForSale] = useState(null);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editedInventory, setEditedInventory] = useState({});




  const handleStatusChange = async (inventoryId, newStatus) => {
    console.log("Checking Sale Requests before status change...");
    console.log("Sale Requests State:", saleRequests);
    console.log("Pending Requests:", saleRequests.pending);
    console.log("Inventory ID to Check:", inventoryId);
    // Find the current status of the inventory item
    const inventoryItem = projectInventories
      .flatMap(project => project.inventory)
      .find(item => item._id === inventoryId);

    const currentStatus = inventoryItem?.status || "";



    const hasPendingRequest = saleRequests.pending.some((request) => {
      const requestInventoryId = request.inventoryId._id; // ✅ Extract the correct _id
      console.log("Comparing:", requestInventoryId, "with", inventoryId);
      return requestInventoryId === inventoryId; // Compare as strings
    });

    console.log("pending request", hasPendingRequest);

    if (hasPendingRequest) {
      alert("This property has a pending sale request. Please reject the request before marking it as Sold.");
      return;
    }

    // If changing to "Sold", ask for confirmation
    if (newStatus === "Sold" && currentStatus !== "Sold") {
      const confirmSale = window.confirm(
        "Are you sure you want to mark this property as Sold? Once sold, it cannot be changed later."
      );
      if (!confirmSale) return;

      // Find the inventory item and set it for the sale form
      projectInventories.forEach(project => {
        const item = project.inventory.find(item => item._id === inventoryId);
        if (item) {
          setSelectedInventoryForSale(item);
        }
      });
      return; // Exit here to show the form
    }
    if (newStatus === "Unsold" && currentStatus === "Sold") {
      const confirmUnsold = window.confirm(
        "Are you sure you want to mark this Sold property as Unsold? Customer data will be removed."
      );
      if (!confirmUnsold) return;
    }
    if (newStatus === "Hold" && currentStatus === "Sold") {
      const confirmHold = window.confirm(
        "Are you sure you want to mark this Sold property as Hold? Customer details will be cleared."
      );
      if (!confirmHold) return;
    }


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

    console.log("Cache before updating:", localStorage.getItem('projectInventories'));

    // Update the cache immediately after the optimistic UI update
    localStorage.setItem('projectInventories', JSON.stringify(projectInventories));

    // Check the cache after updating
    console.log("Cache after updating:", localStorage.getItem('projectInventories'));

    try {
      const response = await fetch(`${API_BASE_URL}/api/project/inventory/${inventoryId}/update-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}`, },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        console.log(`Status updated to ${newStatus} successfully.`);
        localStorage.setItem('projectInventories', JSON.stringify(projectInventories));
      } else {
        // If the API call fails, revert the optimistic change
        setProjectInventories((prevInventories) => {
          return prevInventories.map((project) => {
            project.inventory = project.inventory.map((item) => {
              if (item._id === inventoryId) {
                return { ...item, status: currentStatus }; // Revert the change
              }
              return item;
            });
            return project;
          });
        });
        alert(result.message || "Failed to update status.");
      }
    } catch (error) {
      // If an error occurs, revert the optimistic change
      setProjectInventories((prevInventories) => {
        return prevInventories.map((project) => {
          project.inventory = project.inventory.map((item) => {
            if (item._id === inventoryId) {
              return { ...item, status: currentStatus }; // Revert the change
            }
            return item;
          });
          return project;
        });
      });
      console.error("Error updating status:", error);
      alert("Error updating status.");
    }
  };
  const [inventoryPages, setInventoryPages] = useState({});
  const inventoriesPerPage = 6;





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

        const page = inventoryPages[project.projectId] || 1;
        const start = (page - 1) * inventoriesPerPage;
        const paginatedInventory = filteredInventory.slice(start, start + inventoriesPerPage);

        return {
          ...project,
          inventory: paginatedInventory,
          totalInventory: filteredInventory.length,
        };

      })
      .filter((project) => project.inventory.length > 0 || towerSearchQueries[project.projectId]);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);


    const handleInventoryPageChange = (projectId, direction, totalInventories) => {
      setInventoryPages((prev) => {
        const current = prev[projectId] || 1;
        const totalPages = Math.ceil(totalInventories / inventoriesPerPage);
        const nextPage = direction === "next"
          ? Math.min(current + 1, totalPages)
          : Math.max(current - 1, 1);
        return { ...prev, [projectId]: nextPage };
      });
    };
    const handleSaveInventory = async (id, updatedData) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/project/update-inventory/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData),
        });

        if (!res.ok) throw new Error("Failed to update inventory");

        const updated = await res.json();

        // Update local state
        setProjectInventories((prevProjects) => {
          const updatedProjects = prevProjects.map((project) => {
            return {
              ...project,
              inventory: project.inventory.map((inv) =>
                inv._id === id ? { ...inv, ...updatedData } : inv
              ),
            };
          });
    
          // Update the cache with the new inventory data
          localStorage.setItem('projectInventories', JSON.stringify(updatedProjects));
    
          return updatedProjects; // Return the updated state for re-render
        });

      } catch (err) {
        console.error("Error updating inventory:", err);
      }
    };



    if (loading) return <p>Loading inventories...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
      <div className="">
        {selectedInventoryForSale && (

          <SaleForm
            inventory={selectedInventoryForSale}
            closeForm={() => setSelectedInventoryForSale(null)}
            userId={users._id} // Make sure you have access to user ID
          />

        )}

        {/* Filters */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex justify-between w-full">
            <div>
              <h1 className='americana font-bold text-3xl'>Project Inventories</h1>
            </div>
            <div className='flex'>
            <ProjectSelectDropdown
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              projectInventories={projectInventories}
              setCurrentPage={setCurrentPage}
            />
            <CustomSelect filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
            </div>
          </div>
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
              <h3 className="text-center americana text-lg font-bold lg:text-3xl">
                {project.projectName}
              </h3>
              <input
                type="text"
                placeholder="Search towers or units..."
                value={towerSearchQueries[project.projectId] || ""}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setTowerSearchQueries((prev) => ({
                    ...prev,
                    [project.projectId]: newQuery,
                  }));

                  // Reset inventory page for that project
                  setInventoryPages((prev) => ({
                    ...prev,
                    [project.projectId]: 1,
                  }));
                }}
                className="border rounded-lg shadow-sm ml-4 px-4 py-2"
              />

            </div>

            {/* Inventory Table or No Inventory Message */}
            {project.inventory.length > 0 ? (
              <div className="overflow-y-hidden hide-scrollbar max-h-[95vh]  border border-gray-300 shadow-sm">
                
              <table className="min-w-full text-sm text-center border-collapse">
                <thead className="sticky top-0 z-10 bg-white shadow-sm">
                  <tr className="bg-gray-100 text-gray-800 font-semibold text-xs uppercase tracking-wide">
                      <th className="px-4 py-2 border lora">AREA (Sq.Yard)</th>
                      <th className="px-4 py-2 border lora">W</th>
                      <th className="px-4 py-2 border lora">L</th>
                      <th className="px-4 py-2 border lora">Type</th>
                      <th className="px-4 py-2 border lora">Unit No.</th>
                      <th className="px-4 py-2 border lora">Floor</th>
                      <th className="px-4 py-2 border lora">Status</th>
                      <th className="px-4 py-2 border lora">Carpet Area</th>
                      <th className="px-4 py-2 border lora">Terrace Area</th>
                      <th className="px-4 py-2 border lora">Stilt Area</th>
                      <th className="px-4 py-2 border lora">Basement Area</th>
                      <th className="px-4 py-2 border lora">Mumty</th>
                      <th className="px-4 py-2 border lora">Common Area</th>
                      <th className="px-4 py-2 border lora">Actual Area</th>
                      <th className="px-4 py-2 border lora">PLC</th>
                      <th className="px-4 py-2 border lora">Charges</th>
                      <th className="px-4 py-2 border lora">Edit</th>

                    </tr>
                  </thead>
                  <tbody>
                    {project.inventory.map((item) => {
                      const isEditing = editingInventoryId === item._id;
                      return (
                        <tr key={item._id}>
                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                              type="number"
                              className="border px-2 py-1 w-20"
                              value={editedInventory.areaSqYard !== undefined ? editedInventory.areaSqYard : item.areaSqYard}
                              onChange={(e) =>
                                setEditedInventory((prev) => ({
                                  ...prev,
                                  areaSqYard: e.target.value,
                                }))
                              }
                            />
                            ) : (
                              Number(item.areaSqYard).toFixed(2)
                            )}
                          </td>
                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.W !== undefined ? editedInventory.W : item.W}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    W: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.W
                            )}
                          </td>
                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.L !== undefined ? editedInventory.L : item.L}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    L: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.L
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-24"
                                value={editedInventory.type !== undefined ? editedInventory.type : item.type}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.type
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-24"
                                value={editedInventory.unitNumber !== undefined ? editedInventory.unitNumber : item.unitNumber}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    unitNumber: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.unitNumber
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-16"
                                value={editedInventory.floor !== undefined ? editedInventory.floor : item.floor}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    floor: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.floor
                            )}
                          </td>
                          <td className="px-4 py-2 poppins">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item._id, e.target.value)}
                              disabled={false}
                              className={`font-bold  text-center px-2 py-1 rounded ${item.status === "Sold"
                                ? "text-green-600  bg-gray-200 "
                                : item.status === "Unsold"
                                  ? "text-red-600 cursor-pointer"
                                  : "text-yellow-500 cursor-pointer"
                                }`}
                            >
                              <option value="Sold">Sold</option>
                              <option value="Unsold">Unsold</option>
                              <option value="Hold">Hold</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.carpetArea !== undefined ? editedInventory.carpetArea : item.carpetArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    carpetArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.carpetArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.terraceArea !== undefined ? editedInventory.terraceArea : item.terraceArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    terraceArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.terraceArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.stiltArea !== undefined ? editedInventory.stiltArea : item.stiltArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    stiltArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.stiltArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.basementArea !== undefined ? editedInventory.basementArea : item.basementArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    basementArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.basementArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.mumty !== undefined ? editedInventory.mumty : item.mumty}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    mumty: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.mumty).toFixed(2)
                            )}
                          </td>
                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.commonArea !== undefined ? editedInventory.commonArea : item.commonArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    commonArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.commonArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="number"
                                className="border px-2 py-1 w-20"
                                value={editedInventory.actualArea !== undefined ? editedInventory.actualArea : item.actualArea}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    actualArea: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              Number(item.actualArea).toFixed(2)
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-24"
                                value={editedInventory.PLC !== undefined ? editedInventory.PLC : item.PLC}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    PLC: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.PLC
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            {isEditing ? (
                              <input
                                type="text"
                                className="border px-2 py-1 w-24"
                                value={editedInventory.plcCharges !== undefined ? editedInventory.plcCharges : item.plcCharges}
                                onChange={(e) =>
                                  setEditedInventory((prev) => ({
                                    ...prev,
                                    plcCharges: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              parseFloat(item.plcCharges) >= 0 && parseFloat(item.plcCharges) <= 1
                                ? `${parseFloat(item.plcCharges) * 100}%`
                                : item.plcCharges
                            )}
                          </td>

                          <td className="px-4 py-2 poppins">
                            <button
                              onClick={() => {
                                if (isEditing) {
                                  // Save logic here
                                  handleSaveInventory(item._id, editedInventory);
                                  setEditingInventoryId(null);
                                  setEditedInventory({});
                                } else {
                                  setEditingInventoryId(item._id);
                                  setEditedInventory(item);
                                }
                              }}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              {isEditing ? "Save" : "Edit"}
                            </button>
                          </td>


                        </tr>
                      );
                    })}
                  </tbody>

                </table>
                {/* Inventory Pagination */}
                {project.totalInventory > inventoriesPerPage && (
                  <div className="flex justify-center items-center my-3">
                    <button
                      onClick={() =>
                        handleInventoryPageChange(project.projectId, "prev", project.totalInventory)
                      }
                      disabled={(inventoryPages[project.projectId] || 1) === 1}
                      className="mx-2 p-1 rounded-full hover:bg-gray-200 disabled:text-gray-400"
                    >
                      <RiArrowLeftSLine size={24} />
                    </button>
                    <span className="text-sm mx-1 text-gray-700">
                      Page {inventoryPages[project.projectId] || 1} of{" "}
                      {Math.ceil(project.totalInventory / inventoriesPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        handleInventoryPageChange(project.projectId, "next", project.totalInventory)
                      }
                      disabled={
                        ((inventoryPages[project.projectId] || 1) * inventoriesPerPage) >= project.totalInventory
                      }
                      className="mx-2 p-1 rounded-full hover:bg-gray-200 disabled:text-gray-400"
                    >
                      <RiArrowRightSLine size={24} />
                    </button>
                  </div>
                )}

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
              className={`mx-2 text-black text-3xl rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
                }`}
            >
              <RiArrowLeftSLine />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`mx-2 text-black text-3xl rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""
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


    const userName = localStorage.getItem("userName") || "Aditya";

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

console.log("sale requests", saleRequests);

// Flatten all requests from all statuses
const allRequests = [
  ...(saleRequests?.pending || []),
  ...(saleRequests?.approved || []),
  ...(saleRequests?.rejected || [])
];

allRequests.forEach((request) => {
  const inventory = request.inventory;
  const inventoryProject = inventory?.projectName;

  // Only include requests for the selected project
  const isProjectMatch = !chosenProject || inventoryProject === chosenProject;

  if (isProjectMatch && request.status === "Approved") {
    const soldDate = new Date(request.createdAt);
    if (!isNaN(soldDate.getTime())) {
      const soldMonth = soldDate.toLocaleString("default", { month: "long", year: "numeric" });
      if (!dataByMonthSold[soldMonth]) {
        dataByMonthSold[soldMonth] = 0;
      }
      dataByMonthSold[soldMonth]++;
    }
  }

  if (isProjectMatch && request.status === "Hold") {
    const holdDate = new Date(request.createdAt);
    if (!isNaN(holdDate.getTime())) {
      const holdMonth = holdDate.toLocaleString("default", { month: "long", year: "numeric" });
      if (!dataByMonthHold[holdMonth]) {
        dataByMonthHold[holdMonth] = 0;
      }
      dataByMonthHold[holdMonth]++;
    }
  }
});



    // selectedProjectData.forEach((project) => {
    //   project.inventory.forEach((item) => {
    //     // Sold Properties logic
    //     if (item.status === 'Sold') {
    //       const soldDate = item.createdAt ? new Date(item.createdAt) : null;
    //       if (soldDate && !isNaN(soldDate.getTime())) {
    //         const soldMonth = soldDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    //         if (!dataByMonthSold[soldMonth]) {
    //           dataByMonthSold[soldMonth] = 0;
    //         }
    //         dataByMonthSold[soldMonth]++;
    //       }
    //     }
    //     // Hold Properties logic
    //     if (item.status === 'Hold') {
    //       const holdDate = item.createdAt ? new Date(item.createdAt) : null;
    //       if (holdDate && !isNaN(holdDate.getTime())) {
    //         const holdMonth = holdDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    //         if (!dataByMonthHold[holdMonth]) {
    //           dataByMonthHold[holdMonth] = 0;
    //         }
    //         dataByMonthHold[holdMonth]++;
    //       }
    //     }
    //   });
    // });

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
        <div className="min-h-screen  p-4">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <select
              value={chosenProject}
              onChange={(e) => setChosenProject(e.target.value)}
              className="w-[180px] border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Projects</option>
              {projectInventories.map((project) => (
                <option key={project.projectName} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded shadow text-sm"
            >
              <span>{userName}</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                {userName.charAt(0)}
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setActiveTab("profile");
                    setDropdownOpen(false);
                  }}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Total Properties", value: totalProperties, icon: <Building2 className="text-primary" />, bg: "bg-primary/10" },
            { label: "Sold Properties", value: soldProperties, icon: <CheckCircle2 className="text-green-600" />, bg: "bg-green-100" },
            { label: "Unsold Properties", value: unsoldProperties, icon: <CircleX className="text-red-600" />, bg: "bg-red-100" },
            { label: "Hold Properties", value: holdProperties, icon: <Clock className="text-amber-600" />, bg: "bg-amber-100" },
          ].map((metric, idx) => (
            <div key={idx} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`rounded-full p-2 ${metric.bg}`}>{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[{ title: "Sales Trend", data: soldChartData }, { title: "Hold Trend", data: holdChartData }].map((chart, idx) => (
            <div key={idx} className={`col-span-1 ${idx === 0 ? "md:col-span-2" : ""} border rounded bg-white shadow-sm`}>
              <div className="px-4 pt-4 font-medium text-base">{chart.title}</div>
              <div className="p-4 h-[200px]">
                <Line
                  data={chart.data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                      },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* RECENT PROPERTIES AND REQUESTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recent Properties */}
          <div className="md:col-span-2 border rounded bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="font-medium">Recent Properties</h2>
              <button onClick={() => setActiveTab("projects")} className="text-sm text-blue-600 flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="overflow-auto max-h-[180px]">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    {["Project", "Area", "Floor", "Unit", "PLC", "Status"].map((head, idx) => (
                      <th key={idx} className="text-left px-4 py-2 font-medium text-gray-600">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedProjectData.flatMap((project) =>
                    project.inventory.slice(0, 3).map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{project.projectName}</td>
                        <td className="px-4 py-2">{item.areaSqYard}</td>
                        <td className="px-4 py-2">{item.floor}</td>
                        <td className="px-4 py-2">{item.unitNumber}</td>
                        <td className="px-4 py-2">{item.PLC}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded font-medium ${
                              item.status === "Sold"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Hold"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="border rounded bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="font-medium">Pending Requests</h2>
              <button onClick={() => setActiveTab("requests")} className="text-sm text-blue-600 flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="overflow-auto max-h-[180px] px-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((request, index) => (
                  <div key={request._id} className="border rounded p-2 mb-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 text-xs rounded">Pending</span>
                      <span className="text-xs text-gray-500">Request #{index + 1}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {request.inventoryId.customerName || "Unknown Customer"}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3" /> Unit {request.inventoryId.unitNumber || "N/A"}
                      </div>
                      <div>By: {request.createdBy.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 h-[180px] flex items-center justify-center">No pending requests</div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {hasPendingRequests && isNotificationVisible && (
          <div className="fixed bottom-4 right-4 bg-amber-50 border border-amber-200 rounded-lg p-4 w-80 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-amber-800 font-semibold">Pending Requests</h3>
              <button onClick={() => setIsNotificationVisible(false)} className="h-6 w-6">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="mt-2 text-sm text-amber-800">
              You have {saleRequests.pending.length} pending requests:
              <ul className="mt-2 space-y-1 text-xs">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request, index) => {
                    // Safely get the inventory data whether it's populated or not
                    const inventoryData = request.inventoryId?._id 
                      ? request.inventoryId  // If populated
                      : projectInventories
                          .flatMap(p => p.inventory)
                          .find(i => i._id === request.inventoryId) || {}; // If not populated, find in inventory
                    
                    // Get customer name with fallback
                    const customerName = request.customerName || 
                                        inventoryData.customerName || 
                                        "Customer Name Not Available";
                    
                    // Get unit number with fallback
                    const unitNumber = inventoryData.unitNumber || "N/A";
                    
                    // Get creator name with fallback
                    const createdByName = request.createdBy?.name || 
                                        "Executive";

                    return (
                      <div key={request._id} className="border rounded p-2 mb-2">
                        <div className="flex justify-between items-center">
                          <span className="bg-amber-50 text-amber-700 px-2 py-1 text-xs rounded">
                            Pending
                          </span>
                          <span className="text-xs text-gray-500">
                            Request #{index + 1}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {customerName}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" /> Unit {unitNumber}
                          </div>
                          <div>By: {createdByName}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-500 h-[180px] flex items-center justify-center">
                    No pending requests
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
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
        const response = await fetch(`${API_BASE_URL}/api/user/get`, {
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
        const response = await fetch(`${API_BASE_URL}/api/user/update`, {
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
  <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">
    <MdModeEditOutline
      className="absolute top-4 right-4 text-gray-600 hover:text-blue-600 cursor-pointer transition"
      onClick={() => setIsEditing(true)}
      size={20}
    />

    <div className="flex justify-center mb-4">
      <FaCircleUser className="text-6xl text-gray-400" />
    </div>

    <h1 className="text-center text-2xl font-semibold text-gray-800 mb-2">Profile</h1>

    {profileError && <p className="text-red-600 text-sm text-center mb-2">{profileError}</p>}
    {profileSuccess && <p className="text-green-600 text-sm text-center mb-2">{profileSuccess}</p>}

    <div className="space-y-4">
      {isEditing ? (
        <>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profileName}
              onChange={handleProfileInputChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profilePhone}
              onChange={handleProfileInputChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={profilePassword}
              onChange={handleProfileInputChange}
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={profileLoading}
            className={`w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition ${
              profileLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {profileLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700 text-base">
            <strong>Name:</strong> {profileName}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Phone:</strong> {profilePhone}
          </p>
        </div>
      )}
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

    fetch(`${API_BASE_URL}/api/user/all`, {
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
    setEditableData((prev) => {
      const updatedData = {
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          [field]: value,
        },
      };
      console.log("Updated Data:", updatedData)
      return { ...updatedData }; // Ensure new reference
    });
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
    setUserLoading(true);
    try {
      const originalUser = users.find(user => user._id === userId);
      const changes = editableData[userId];

    // Check for sensitive transitions like role downgrade
    if (originalUser.role === "manager" && changes.role === "executive") {
      const confirmChange = window.confirm(
        "Changing this user from Manager to Executive will remove their manager-level access. Any assigned executives will no longer be linked. Do you want to proceed?"
      );
      if (!confirmChange) {
        setUserLoading(false);
        return;
      }
    }

      // Check what is currently stored
      console.log("Before Update:", originalUser);

      // Ensure we preserve fields
      const updatedUser = {
        ...editableData[userId],
        visibleFields: Array.from(editableData[userId]?.visibleFields || new Set(originalUser?.visibleFields || [])),
        assignedProjects: editableData[userId]?.assignedProjects || originalUser?.assignedProjects || [],
        hiddenInventories: editableData[userId]?.hiddenInventories ?? originalUser?.hiddenInventories ?? [],
      };
      if (editableData[userId]?.password) {
        updatedUser.password = editableData[userId].password;
      }
      if (editableData[userId]?.email !== undefined) {
        updatedUser.email = editableData[userId].email;
      }
      if (editableData[userId]?.gstNumber !== undefined) {
        updatedUser.gstNumber = editableData[userId].gstNumber;
      }
      if (editableData[userId]?.reraNumber !== undefined) {
        updatedUser.reraNumber = editableData[userId].reraNumber;
      }
      if (editableData[userId]?.role !== undefined) {
        updatedUser.role = editableData[userId].role;
      }
      if (editableData[userId]?.managerId !== undefined) {
        updatedUser.managerId = editableData[userId].managerId;
      }
      

      console.log("Payload Sent to API:", updatedUser); // Check if visibleFields and assignedProjects are correct

      const res = await fetch(`${API_BASE_URL}/api/user/update/${userId}`, {
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
              name: updatedData.name ?? originalUser.name,
              phone: updatedData.phone ?? originalUser.phone,
              email: updatedData.email ?? originalUser.email,
              gstNumber: updatedData.gstNumber ?? originalUser.gstNumber,
              role: updatedData.role ?? originalUser.role,
              managerId: updatedData.managerId ?? originalUser.managerId,
              reraNumber: updatedData.reraNumber ?? originalUser.reraNumber,
              visibleFields: updatedData.visibleFields ?? originalUser.visibleFields,
              assignedProjects: updatedData.assignedProjects ?? originalUser.assignedProjects,
              hiddenInventories: updatedData.hiddenInventories ?? originalUser.hiddenInventories,
            }
            : u
        )
      );

      window.location.reload();


    } catch (error) {
      console.error("Error updating user:", error);
      alert("Update failed.");
    } finally {
      setUserLoading(false);
    }
  };
  const toggleHiddenInventory = (userId, inventoryId) => {
  setEditableData((prev) => {
    const current = new Set(prev[userId]?.hiddenInventories || []);
    if (current.has(inventoryId)) {
      current.delete(inventoryId); // remove if already selected
    } else {
      current.add(inventoryId); // add if new
    }
    return {
      ...prev,
      [userId]: {
        ...prev[userId],
        hiddenInventories: Array.from(current),
      },
    };
  });
};



  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token"); // Get token from localStorage (or use cookies if stored there)

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/delete/${userId}`, {
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
                const response = await fetch(`${API_BASE_URL}/api/project/create`, {
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
              const email = form.email.value.trim();
              const gstNumber = form.gstNumber.value.trim();
              const reraNumber = form.reraNumber.value.trim();
              const managerId = form.managerId ? form.managerId.value : "";
              const role = form.role.value;
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
                role,
                assignedProjects,
                visibleFields,
                ...(email && { email }), // Only include if provided
                ...(gstNumber && { gstNumber }),
                ...(reraNumber && { reraNumber }),
                ...(managerId && { managerId }),
              };

              try {
                const response = await fetch(`${API_BASE_URL}/api/user/register`, {
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
                setRole("");
              } catch (error) {
                console.error('Error:', error);
                alert('Failed to register executive');
              }
            }}
          >
            <h2 className="text-2xl font-bold lg:text-4xl mb-7">Register Manager/User</h2>

            <div>
              <label htmlFor="name" className="text-gray-700 block">
                User/Manager Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="border-b border-b-black w-full block focus:outline-none mt-1"
              />
            </div>
            {/* <div>
              <label htmlFor="managerId" className="text-gray-700 block">Assign Manager (Optional)</label>
              <select
                id="managerId"
                name="managerId"
                className="border-b border-b-black w-full block focus:outline-none mt-1"
              >
                <option value="">Select a Manager</option>
                {users
                  .filter((user) => user.role === "manager")
                  .map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name} 
                    </option>
                  ))}
              </select>
            </div> */}
            <div>
              <label htmlFor="role" className="text-gray-700 block">Select Role</label>
              <select
                id="role"
                name="role"
                required
                className="border-b border-b-black w-full block focus:outline-none mt-1"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="">Select a Role</option>
                <option value="executive">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            {role === 'executive' && (
        <div>
          <label htmlFor="managerId" className="text-gray-700 block">Assign Manager</label>
          <select
            id="managerId"
            name="managerId"
            className="border-b border-b-black w-full block focus:outline-none mt-1"
          >
            <option value="">Select a Manager</option>
            {users
              .filter((user) => user.role === 'manager')
              .map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
          </select>
        </div>
      )}



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
            <div>
              <label htmlFor="gstNumber" className="text-gray-700 block">GST Number (Optional)</label>
              <input type="text" id="gstNumber" name="gstNumber" className="border-b border-b-black w-full block focus:outline-none mt-1" />
            </div>

            <div>
              <label htmlFor="reraNumber" className="text-gray-700 block">RERA Number (Optional)</label>
              <input type="text" id="reraNumber" name="reraNumber" className="border-b border-b-black w-full block focus:outline-none mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700 block">Email (Optional)</label>
              <input type="email" id="email" name="email" className="border-b border-b-black w-full block focus:outline-none mt-1" />
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
      case 'profile':
        return renderProfileUpdate();
      case 'users':
        return (
          <div className="bg-white p-6 lg:p-12 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            <div className="mb-6 flex items-center space-x-4">
                      <label htmlFor="roleFilter" className="font-medium text-gray-700">Filter by Role:</label>
                      <select
                        id="roleFilter"
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="all">All</option>
                        <option value="executive">User</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(users) && users.length > 0 ? (
                users
                .filter(user => selectedRoleFilter === "all" || user.role === selectedRoleFilter)
                .map(user => (
              
                  <div key={user._id} className="p-4 border rounded-lg shadow relative bg-gray-50">
                    {/* Edit Icon */}
                    

                    <div className="absolute top-3 right-3 flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingUser(prev => prev === user._id ? null : user._id);
                          setEditableData((prev) => ({
                            ...prev,
                            [user._id]: prev[user._id] || {
                              name: user.name ?? "",  // Ensure string fallback
                              phone: user.phone ?? "",
                              email: user.email ?? "",
                              role : user.role ?? "executive",
                              gstNumber: user.gstNumber ?? "",
                              reraNumber: user.reraNumber ?? "",
                              visibleFields: new Set(user.visibleFields || []),
                              assignedProjects: [...(user.assignedProjects || [])],
                              hiddenInventories: [...(user.hiddenInventories || [])],
                              managerId: user.managerId ?? "",
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
                        <p className="text-sm">Are you sure you want to delete this user? It will delete all its history including its broker details but all its previous sold properties will remain sold.</p>
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
                        value={editingUser === user._id ? editableData[user._id]?.name ?? user.name ?? "" : user.name ?? ""}
                        disabled={user._id !== editingUser}
                        onChange={(e) => handleEditChange(user._id, 'name', e.target.value)}
                        className={`border-b w-full bg-transparent ${user._id === editingUser ? 'border-black' : 'border-gray-300'}`}
                      />
                    </div>
                    {(editingUser === user._id ? editableData[user._id]?.role : user.role) === "executive" && (
                      <div className="mb-2">
                        <label className="text-gray-700 block">Manager</label>

                        {editingUser === user._id ? (
                          <select
                            value={editableData[user._id]?.managerId ?? user.managerId ?? ""}
                            onChange={(e) => handleEditChange(user._id, "managerId", e.target.value)}
                            className="border-b border-black w-full bg-transparent"
                          >
                            <option value="">Select a Manager</option>
                            {users
                              .filter((u) => u.role === "manager" && u._id !== user._id)
                              .map((manager) => (
                                <option key={manager._id} value={manager._id}>
                                  {manager.name}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <>
                            <p className="text-gray-800">
                              {users.find((u) => u._id === user.managerId)?.name || "Not Assigned"}
                            </p>
                          </>
                        )}
                      </div>
                    )}





                    <div className="mb-2">
                      <label className="text-gray-700 block">Phone</label>
                      <input
                        type="text"
                        value={editingUser === user._id ? editableData[user._id]?.phone ?? user.phone ?? "" : user.phone ?? ""}
                        disabled={user._id !== editingUser}
                        onChange={(e) => handleEditChange(user._id, 'phone', e.target.value)}
                        className={`border-b w-full bg-transparent ${user._id === editingUser ? 'border-black' : 'border-gray-300'}`}
                      />
                    </div>
                    {/* Email */}
                    <div className="mb-2">
                      <label className="text-gray-700 block">Email</label>
                      <input
                        type="email"
                        value={editingUser === user._id ? editableData[user._id]?.email ?? user.email ?? "" : user.email ?? ""}
                        disabled={user._id !== editingUser}
                        onChange={(e) => handleEditChange(user._id, "email", e.target.value)}
                        className={`border-b w-full bg-transparent ${user._id === editingUser ? "border-black" : "border-gray-300"}`}
                      />
                    </div>

                    {/* GST Number */}
                    <div className="mb-2">
                      <label className="text-gray-700 block">GST Number</label>
                      <input
                        type="text"
                        value={editingUser === user._id ? editableData[user._id]?.gstNumber ?? user.gstNumber ?? "" : user.gstNumber ?? ""}

                        disabled={user._id !== editingUser}
                        onChange={(e) => handleEditChange(user._id, "gstNumber", e.target.value)}
                        className={`border-b w-full bg-transparent ${user._id === editingUser ? "border-black" : "border-gray-300"}`}
                      />
                    </div>
                    {/* Hidden Inventories Dropdown */}
                    <div className="mb-4">
                      <label className="text-gray-700 font-semibold">Hidden Inventories</label>
                      {user._id === editingUser ? (
                        <div className="border p-2 rounded-md bg-white max-h-40 overflow-y-auto space-y-1">
                          {projectInventories
                            .filter((p) =>
                              editableData[user._id]?.assignedProjects.includes(p.projectId) ||
                              user.assignedProjects.includes(p.projectId)
                            )
                            .flatMap((p) =>
                              p.inventory.map((inv) => {
                                
                                const isChecked = editableData[user._id]?.hiddenInventories
                                ? editableData[user._id].hiddenInventories.includes(inv._id)
                                : user.hiddenInventories?.includes(inv._id) || false;

                                
    

                                return (
                                  <label key={inv._id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        setEditableData((prev) => {
                                          const prevHidden =
                                            prev[user._id]?.hiddenInventories || [];
                                          const updated = e.target.checked
                                            ? [...prevHidden, inv._id]
                                            : prevHidden.filter((id) => id !== inv._id);
                                          return {
                                            ...prev,
                                            [user._id]: {
                                              ...prev[user._id],
                                              hiddenInventories: updated,
                                            },
                                          };
                                        });
                                      }}
                                      className="accent-gray-700"
                                    />
                                    <span>
                                      {p.projectName} - Unit {inv.unitNumber} ({inv.floor})
                                    </span>
                                  </label>
                                );
                              })
                            )}
                        </div>
                      ) : (
                        <div className="text-gray-800 text-sm">
                          {user.hiddenInventories && user.hiddenInventories.length > 0 ? (
                            <span className="font-medium">
                              Hidden {user.hiddenInventories.length} Inventor{user.hiddenInventories.length > 1 ? "ies" : "y"}
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </div>
                      )}
                    </div>



                    {/* RERA Number */}
                    <div className="mb-2">
                      <label className="text-gray-700 block">RERA Number</label>
                      <input
                        type="text"
                        value={editingUser === user._id ? editableData[user._id]?.reraNumber ?? user.reraNumber ?? "" : user.reraNumber ?? ""}
                        disabled={user._id !== editingUser}
                        onChange={(e) => handleEditChange(user._id, "reraNumber", e.target.value)}
                        className={`border-b w-full bg-transparent ${user._id === editingUser ? "border-black" : "border-gray-300"}`}
                      />
                    </div>

                    {user._id === editingUser && (
                      <div className="mb-2 relative">
                        <label className="text-gray-700 block">New Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={user._id === editingUser ? (editableData[user._id]?.password ?? "") : ""}
                          onChange={(e) => handleEditChange(user._id, 'password', e.target.value)}
                          className="border-b w-full bg-transparent border-black"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-600 absolute right-4 top-7"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    )}


                      <div className="mb-2">
                        <label className="text-gray-700 block">Role</label>
                        {user._id === editingUser ? (
                          <select
                            value={editableData[user._id]?.role || user.role}
                            onChange={(e) => handleEditChange(user._id, 'role', e.target.value)}
                            className="border-b w-full bg-transparent border-black"
                          >
                            <option value="executive">User</option>
                            <option value="manager">Manager</option>
                          </select>
                        ) : (
                          <span className="text-lg font-semibold">
                            {user.role === "executive" ? "User" : user.role === "manager" ? "Manager" : "Admin"}
                          </span>
                        )}
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
                        {userLoading ? "Saving..." : "Save Changes"}
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
      case 'userActivity':
        return (
          <UserActivity/>
        )  

      case 'broker':
        return <BrokerDetails />;


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
              <a href='/linkpage'>
                <li
                  className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer `}
                >
                  <p>Home</p><FaHome />
                </li>
              </a>
              <li
                onClick={() => setActiveTab('dashboard')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'dashboard' ? 'bg-gray-300' : ''}`}
              >
                <p>Dashboard</p><BiSolidDashboard />
              </li>
              <li
                onClick={() => setActiveTab('projects')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'projects' ? 'bg-gray-300' : ''}`}
              >
                Projects<IoFolderSharp />
              </li>
              <li
                onClick={() => setActiveTab('requests')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'requests' ? 'bg-gray-300' : ''}`}
              >

                <p>Requests/Payment</p>
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
                Create Inventory<IoIosCreate />
              </li>
              <li
                onClick={() => setActiveTab('createExecutive')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'createExecutive' ? 'bg-gray-300' : ''}`}
              >
                Create CP<IoIosCreate />
              </li>
              <li
                onClick={() => setActiveTab('users')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'users' ? 'bg-gray-300' : ''}`}
              >
                Edit Users<CiEdit />
              </li>
              <li
                onClick={() => setActiveTab('userActivity')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'userActivity' ? 'bg-gray-300' : ''}`}
              >
                Users Activity<FiActivity />
              </li>
              {/* <li
                onClick={() => setActiveTab('broker')}
                className={`text-gray-600 flex flex-row items-center justify-between hover:bg-gray-300 px-2 py-2 rounded cursor-pointer ${activeTab === 'broker' ? 'bg-gray-300' : ''}`}
              >
                Broker Details<CiEdit />
              </li> */}

            </ul>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow overflow-y-scroll bg-gray-300 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-8' : 'px-6 lg:px-0 lg:pl-16'}`}
        >
          <div className="p-4">{renderContent()}</div>
        </div>
      </div>
    </>

  );
};

export default Sidebar;








