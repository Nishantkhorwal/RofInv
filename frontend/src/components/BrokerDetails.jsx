import { useEffect, useState } from "react";
import { FiEdit, FiSave, FiChevronLeft, FiChevronRight } from "react-icons/fi";


const BrokerDetails = () => {
  const [groupedRequests, setGroupedRequests] = useState({});
  const [editingRequest, setEditingRequest] = useState(null); // Track which request is being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [brokersPerPage] = useState(1); // Number of brokers per page (set to 2)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [brokerList, setBrokerList] = useState([]); // Store all brokers

  const fetchAllBrokers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/user/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch brokers");

      const data = await response.json();
      console.log("Fetched brokers:", data);

      if (Array.isArray(data.users)) {
        setBrokerList(data.users);

        // Create brokerId -> brokerName mapping
        const brokerMapping = {};
        data.users.forEach((broker) => {
          brokerMapping[broker._id] = broker.name;
        });

        setBrokerMap(brokerMapping); // ✅ Store mapping
      } else {
        console.error("API did not return an array:", data);
        setBrokerList([]);
      }
    } catch (error) {
      console.error("Error fetching brokers:", error.message);
      setBrokerList([]);
    }
  };





  useEffect(() => {
    fetchAllBrokers();
  }, []);

  useEffect(() => {
    // Reset to first page when broker filter changes
    setCurrentPage(1);
  }, [selectedBroker]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchAllBrokers();
      await fetchData();
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [brokerList]); // Add brokerList as dependency
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const [brokerMap, setBrokerMap] = useState({}); // Map brokerId -> brokerName

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
      setGroupedRequests(data.groupedRequests);

      // Create a comprehensive broker map combining both sources
      const comprehensiveBrokerMap = { ...brokerMap };

      // Add brokers from the grouped requests
      Object.keys(data.groupedRequests).forEach((brokerName) => {
        data.groupedRequests[brokerName].forEach((request) => {
          if (request.mainBroker) {
            comprehensiveBrokerMap[request.mainBroker] = brokerName;
          }
        });
      });

      // Add brokers from the brokerList (ensures all brokers are included)
      brokerList.forEach(broker => {
        comprehensiveBrokerMap[broker._id] = broker.name;
      });

      setBrokerMap(comprehensiveBrokerMap);
    } catch (error) {
      console.error("Error fetching sale requests:", error.message);
    }
  };



  const handleEditClick = (request) => {
    setEditingRequest(request._id === editingRequest ? null : request._id);
  };

  const handleChange = async (requestId, section, field, value) => {
    setGroupedRequests((prev) => {
      const updatedRequests = { ...prev };
      Object.keys(updatedRequests).forEach((broker) => {
        updatedRequests[broker] = updatedRequests[broker].map((req) =>
          req._id === requestId
            ? {
              ...req,
              ...(section === "mainBroker"
                ? { mainBroker: value } // Update broker
                : {
                  [section]: {
                    ...req[section],
                    [field]: value,
                  },
                }),
            }
            : req
        );
      });
      return updatedRequests;
    });

    // ✅ Correctly update brokerMap
    setBrokerMap((prev) => ({
      ...prev,
      [value]: brokerList.find((b) => b._id === value)?.name || "Unknown Broker",
    }));

    console.log("Updated Broker Map:", brokerMap);

    // ✅ Save changes to the backend
    await updateField(requestId, section, field, value);
  };



  useEffect(() => {
    console.log("Updated Broker Map:", brokerMap);
  }, [brokerMap]);





  const updateField = async (requestId, section, field, value) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/project/requests/${requestId}/edit-customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(
          section === "mainBroker" ? { mainBroker: value } : { [section]: { [field]: value } }
        ),
      });
      const responseData = await response.json();
      console.log("Update Response:", responseData);

      if (!response.ok) {
        throw new Error("Failed to update field");
      }

    } catch (error) {
      console.error("Error updating field:", error.message);
    }
  };
  const [searchQueries, setSearchQueries] = useState({}); // Store search queries for each broker

  const handleSearchChange = (broker, query) => {
    setSearchQueries((prev) => ({
      ...prev,
      [broker]: query, // Update search query for the specific broker
    }));
  };

  const filteredRequests = Object.keys(groupedRequests).reduce((acc, brokerName) => {
    if (selectedBroker && selectedBroker !== brokerName) return acc;
    const brokerSearchQuery = searchQueries[brokerName] || "";

    // Always include the broker if it matches the selected filter
    acc[brokerName] = groupedRequests[brokerName].filter((request) =>
      request.customerName?.toLowerCase().includes(brokerSearchQuery.toLowerCase())
    );

    return acc;
  }, {});
  // Get current brokers for pagination
  const brokerNames = Object.keys(filteredRequests);
  const indexOfLastBroker = currentPage * brokersPerPage;
  const indexOfFirstBroker = indexOfLastBroker - brokersPerPage;
  const currentBrokers = brokerNames.slice(indexOfFirstBroker, indexOfLastBroker);
  const totalPages = Math.ceil(brokerNames.length / brokersPerPage);

  // Navigation functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between w-full mb-6 ">
        <h1 className="text-3xl font-bold text-gray-800  text-center">Broker Details</h1>
        <div className="">
          <select
            value={selectedBroker}
            onChange={(e) => setSelectedBroker(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Brokers</option>
            {Object.keys(groupedRequests).map((broker) => (
              <option key={broker} value={broker}>
                {broker}
              </option>
            ))}
          </select>
        </div>
      </div>





      {currentBrokers.map((brokerName) => (
        <div key={brokerName} className="bg-white shadow-lg rounded-lg p-6 mb-10">
          <div className="flex flex-row justify-between w-full border-b pb-2 mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">
              {brokerName}
            </h2>
            <input
              type="text"
              placeholder="Customer name..."
              value={searchQueries[brokerName] || ""}
              onChange={(e) => handleSearchChange(brokerName, e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {filteredRequests[brokerName].length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              No such customer exists for {brokerName}
            </p>
          ) : (

            <div className="space-y-6">
              {filteredRequests[brokerName].map((request) => (

                <div
                  key={request._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-green-500 w-full relative"
                >
                  {/* Edit Icon */}
                  <button
                    onClick={() => handleEditClick(request)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                  >
                    {editingRequest === request._id ? (
                      <FiSave className="w-5 h-5 text-green-600" />
                    ) : (
                      <FiEdit className="w-5 h-5" />
                    )}
                  </button>

                  {/* Status Badge */}
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 bg-green-200 text-green-800">
                    {request.status}
                  </span>

                  {/* Customer Details */}
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-700 mb-6">
                      Customer : {request.customerName}

                    </p>

                    <div className="grid grid-cols-3  gap-5">
                      {[
                        "guardianName",
                        "email",
                        "contactNumber",
                        "address",
                        "state",
                        "country",
                        "pin",
                      ].map((field) => (
                        <p key={field} className="text-gray-600">
                          <strong>{field.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                          {editingRequest === request._id ? (
                            <input
                              type={
                                field === "dateOfBirth"
                                  ? "date"
                                  : field === "age" || field === "pin" || field === "contactNumber"
                                    ? "number"
                                    : "text"
                              }
                              className="border px-2 py-1 rounded w-full"
                              value={request.customerInfo?.[field] || ""}
                              onChange={(e) =>
                                handleChange(request._id, "customerInfo", field, e.target.value)
                              }
                            />
                          ) : field === "dateOfBirth" ? (
                            formatDate(request.customerInfo?.dateOfBirth)
                          ) : (
                            request.customerInfo?.[field] || "N/A"
                          )}
                        </p>

                      ))}
                      <p className="text-gray-600">
                        <strong className="text-gray-800">Unit:</strong> {request.inventoryId.unitNumber} ({request.inventoryId.type})
                      </p>

                      <p className="text-gray-600">
                        <strong>Unit Cost:</strong>{" "}
                        {editingRequest === request._id ? (
                          <input
                            type="number"
                            className="border px-2 py-1 rounded"
                            value={request.unitDetails?.unitCost || ""}
                            onChange={(e) =>
                              handleChange(request._id, "unitDetails", "unitCost", e.target.value)
                            }
                          />
                        ) : (
                          `₹${request.unitDetails?.unitCost?.toLocaleString() || "N/A"}`
                        )}
                      </p>
                      <p className="text-gray-600">
                        <strong>Main Broker:</strong>{" "}
                        {editingRequest === request._id ? (
                          <select
                            className="border px-2 py-1 rounded w-full"
                            value={request.mainBroker || ""}
                            onChange={(e) => handleChange(request._id, "mainBroker", null, e.target.value)}
                          >
                            <option value="">Select a Broker</option>
                            {brokerList.map((broker) => (
                              <option key={broker._id} value={broker._id}>
                                {broker.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          brokerList.find(b => b._id === request.mainBroker)?.name ||
                          brokerMap[request.mainBroker] ||
                          "N/A"
                        )}
                      </p>
                      <p className="text-gray-600">
                        <strong>PAN Card:</strong>{" "}

                        
                        {request.inventoryId.panCardImagePath ?
                          (
                            <a
                              href={`${API_BASE_URL}/${request.inventoryId.panCardImagePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 ms-2"
                            >
                              View Pan Card
                            </a>
                          ) :
                          (
                            <p>Not Uploaded</p>
                          )
                        }
                      </p>

                      <p className="text-gray-600">
                        <strong>Cheque:</strong>{" "}


                        {request.inventoryId.chequeImagePath ?
                          (
                            <a
                              href={`${API_BASE_URL}/${request.inventoryId.chequeImagePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 ms-2"
                            >
                              View Cheque
                            </a>
                          ) :
                          (
                            <p>Not Uploaded</p>
                          )
                        }

                      </p>

                    </div>


                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          {/* Previous button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              {number}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>

  );
};

export default BrokerDetails;





