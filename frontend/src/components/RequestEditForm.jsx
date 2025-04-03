import React, { useState, useEffect } from 'react';

function RequestEditForm({ closeForm, requestId }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    const [users, setUsers] = useState([]); // Store users

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

    const [formData, setFormData] = useState({
        customerName: '',
        customerInfo: {
            guardianName: '',
            age: '',
            dateOfBirth: '',
            nationality: '',
            panNumber: '',
            aadharCardNumber: '',
            occupation: '',
            residentStatus: '',
            address: '',
            state: '',
            country: '',
            pin: '',
            email: '',
            contactNumber: '',
        },
        unitDetails: {
            unitType: '',
            unitCost: '',
            otherCharges: '',
        },
        mainBroker: null,
        panCardImage: null,
        chequeImage: null,
    });
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    };

    useEffect(() => {
        const fetchSaleRequest = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/project/request`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
        
                const data = await response.json();
                console.log("API Response:", data); // Debugging
        
                if (data.saleRequests && Array.isArray(data.saleRequests)) {
                    const saleRequest = data.saleRequests.find(request => request._id === requestId);
        
                    if (saleRequest) {
                        setFormData({
                            customerName: saleRequest.customerName || '',
                            customerInfo: {
                                guardianName: saleRequest.customerInfo?.guardianName || '',
                                age: saleRequest.customerInfo?.age || '',
                                dateOfBirth: saleRequest.customerInfo?.dateOfBirth || '',
                                nationality: saleRequest.customerInfo?.nationality || '',
                                panNumber: saleRequest.customerInfo?.panNumber || '',
                                aadharCardNumber: saleRequest.customerInfo?.aadharCardNumber || '',
                                occupation: saleRequest.customerInfo?.occupation || '',
                                residentStatus: saleRequest.customerInfo?.residentStatus || '',
                                address: saleRequest.customerInfo?.address || '',
                                state: saleRequest.customerInfo?.state || '',
                                country: saleRequest.customerInfo?.country || '',
                                pin: saleRequest.customerInfo?.pin || '',
                                email: saleRequest.customerInfo?.email || '',
                                contactNumber: saleRequest.customerInfo?.contactNumber || '',
                            },
                            unitDetails: {
                                unitType: saleRequest.unitDetails?.unitType || '',
                                unitCost: saleRequest.unitDetails?.unitCost || '',
                                otherCharges: saleRequest.unitDetails?.otherCharges || '',
                            },
                            mainBroker: saleRequest.mainBroker || null,
                            panCardImage: saleRequest.panCardImagePath || null, // Corrected
                            chequeImage: saleRequest.chequeImagePath || null, // Corrected
                        });
                    } else {
                        console.warn("No matching sale request found for requestId:", requestId);
                    }
                } else {
                    console.error("saleRequests is missing or not an array");
                }
            } catch (error) {
                console.error('Error fetching sale requests:', error);
            }
        };
        

        if (requestId) {
            fetchSaleRequest();
        }
    }, [requestId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${API_BASE_URL}/api/project/requests/${requestId}/edit-customer`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log('Sale request updated successfully');
                    closeForm();
                } else {
                    console.error('Failed to update sale request');
                }
            })
            .catch((err) => console.error('Error updating sale request:', err));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 items-center overflow-auto">
            <div className="bg-gray-300 rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-center mb-6">Sale Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                            <input
                                type="text"
                                value={formData.customerName}
                                onChange={(e) =>
                                    setFormData({ ...formData, customerName: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Guardian Name</label>
                            <input
                                type="text"
                                value={formData.customerInfo.guardianName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, guardianName: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.customerInfo.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, email: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Example for age */}
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Pan Card Number</label>
                            <input
                                type="text"
                                value={formData.customerInfo.panNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, panNumber: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Aadhar Card Number</label>
                            <input
                                type="text"
                                value={formData.customerInfo.aadharCardNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, aadharCardNumber: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Address</label>
                            <input
                                type="text"
                                value={formData.customerInfo.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, address: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">State</label>
                            <input
                                type="text"
                                value={formData.customerInfo.state}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, state: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Country</label>
                            <input
                                type="text"
                                value={formData.customerInfo.country}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, country: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Pin</label>
                            <input
                                type="text"
                                value={formData.customerInfo.pin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, pin: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                            <input
                                type="number"
                                value={formData.customerInfo.contactNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerInfo: { ...formData.customerInfo, contactNumber: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700 font-semibold mb-2">Unit Cost</label>
                            <input
                                type="number"
                                value={formData.unitDetails.unitCost}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        unitDetails: { ...formData.unitDetails, unitCost: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>   
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="bg-red-600 text-white py-2 px-4 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RequestEditForm;


