import { useEffect, useState } from "react";
import { FiEdit, FiSave, FiChevronLeft, FiChevronRight  } from "react-icons/fi";


const BrokerDetails = () => {
  const [groupedRequests, setGroupedRequests] = useState({});
  const [editingRequest, setEditingRequest] = useState(null); // Track which request is being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
const [brokersPerPage] = useState(1); // Number of brokers per page (set to 2)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Reset to first page when broker filter changes
    setCurrentPage(1);
  }, [selectedBroker]);

  useEffect(() => {
    fetchData();
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };


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

      // Filter only "Approved" requests
      const filteredRequests = {};
      Object.keys(data.groupedRequests).forEach((broker) => {
        const approvedRequests = data.groupedRequests[broker].filter(
          (request) => request.status === "Approved"
        );
        if (approvedRequests.length > 0) {
          filteredRequests[broker] = approvedRequests;
        }
      });

      setGroupedRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching sale requests:", error.message);
    }
  };

  const handleEditClick = (request) => {
    setEditingRequest(request._id === editingRequest ? null : request._id);
  };

  const handleChange = (requestId, section, field, value) => {
    setGroupedRequests((prev) => {
      const updatedRequests = { ...prev };
      Object.keys(updatedRequests).forEach((broker) => {
        updatedRequests[broker] = updatedRequests[broker].map((req) =>
          req._id === requestId
            ? {
              ...req,
              [section]: {
                ...req[section],
                [field]: value,
              },
            }
            : req
        );
      });
      return updatedRequests;
    });

    // Send update to backend
    updateField(requestId, section, field, value);
  };

  const updateField = async (requestId, section, field, value) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/project/requests/${requestId}/edit-customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          [section]: { [field]: value },
        }),
      });

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
                        Customer:{" "}
                        {editingRequest === request._id ? (
                          <input
                            type="text"
                            className="border px-2 py-1 rounded"
                            value={request.customerName}
                            onChange={(e) =>
                              handleChange(request._id, "customerInfo", "customerName", e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-gray-900">{request.customerName}</span>
                        )}
                      </p>

                      <div className="grid grid-cols-3 gap-4">
  {[
    "guardianName",
    "age",
    "dateOfBirth",
    "nationality",
    "occupation",
    "residentStatus",
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
</div>


                    </div>

                    {/* Unit Details */}
                    <div className="mb-4 border-t pt-3">
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
                        <strong>Other Charges:</strong>{" "}
                        {editingRequest === request._id ? (
                          <input
                            type="number"
                            className="border px-2 py-1 rounded"
                            value={request.unitDetails?.otherCharges || ""}
                            onChange={(e) =>
                              handleChange(request._id, "unitDetails", "otherCharges", e.target.value)
                            }
                          />
                        ) : (
                          `₹${request.unitDetails?.otherCharges?.toLocaleString() || "N/A"}`
                        )}
                      </p>
                    </div>


                    {/* Payment Details */}
                    <div className="mb-4 border-t pt-3">
                      <p className="text-gray-600">
                        <strong>Bank:</strong>{" "}
                        {editingRequest === request._id ? (
                          <input
                            type="text"
                            className="border px-2 py-1 rounded"
                            value={request.paymentDetails?.bankName || ""}
                            onChange={(e) =>
                              handleChange(request._id, "paymentDetails", "bankName", e.target.value)
                            }
                          />
                        ) : (
                          request.paymentDetails?.bankName || "N/A"
                        )}
                      </p>
                      <p className="text-gray-600">
    <strong>Cheque Number:</strong>{" "}
    {editingRequest === request._id ? (
      <input
        type="text"
        className="border px-2 py-1 rounded"
        value={request.paymentDetails?.chequeNumber || ""}
        onChange={(e) =>
          handleChange(request._id, "paymentDetails", "chequeNumber", e.target.value)
        }
      />
    ) : (
      request.paymentDetails?.chequeNumber || "N/A"
    )}
  </p>

  <p className="text-gray-600">
    <strong>Cheque Date:</strong>{" "}
    {editingRequest === request._id ? (
      <input
        type="date"
        className="border px-2 py-1 rounded"
        value={new Date(request.paymentDetails?.date).toISOString().split("T")[0] || ""}
        onChange={(e) =>
          handleChange(request._id, "paymentDetails", "date", e.target.value)
        }
      />
    ) : (
      formatDate(request.paymentDetails?.date)
    )}
  </p>

  <p className="text-gray-600">
    <strong>Amount:</strong>{" "}
    {editingRequest === request._id ? (
      <input
        type="number"
        className="border px-2 py-1 rounded"
        value={request.paymentDetails?.amount || ""}
        onChange={(e) =>
          handleChange(request._id, "paymentDetails", "amount", e.target.value)
        }
      />
    ) : (
      `₹${request.paymentDetails?.amount?.toLocaleString() || "N/A"}`
    )}
  </p>
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





