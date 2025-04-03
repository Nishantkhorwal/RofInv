import { useState, useEffect } from 'react';

const SaleForm = ({ inventory, closeForm, userId }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
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
        paymentDetails: {
            chequeNumber: '',
            date: '',
            amount: '',
            bankName: '',
        },
        mainBroker: null,  // Optional field for broker ID
        panCardImage: null,
        chequeImage: null,
    });
    const [users, setUsers] = useState([]); // Store users
    const [selectedBroker, setSelectedBroker] = useState("");

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

    const handleChange = (e) => {
       

        const { name, value, dataset } = e.target;

        if (dataset.nested) {
            setFormData((prevData) => ({
                ...prevData,
                [dataset.object]: {
                    ...prevData[dataset.object],
                    [name]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],  // Only accepting a single file for each input
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        const {
            customerName,
            customerInfo,
            unitDetails,
            paymentDetails,
            panCardImage,
            chequeImage,
            mainBroker,
        } = formData;

        if (!customerName || !panCardImage || !chequeImage || !customerInfo) {
            alert('Please fill in all the required fields.');
            return;
        }

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('inventoryId', inventory._id);
        formDataToSubmit.append('status', 'Sold');
        formDataToSubmit.append('customerName', customerName);

        Object.keys(customerInfo).forEach((key) => {
            formDataToSubmit.append(`customerInfo[${key}]`, customerInfo[key]);
        });

        Object.keys(unitDetails).forEach((key) => {
            formDataToSubmit.append(`unitDetails[${key}]`, unitDetails[key]);
        });

        Object.keys(paymentDetails).forEach((key) => {
            formDataToSubmit.append(`paymentDetails[${key}]`, paymentDetails[key]);
        });

        if (panCardImage) formDataToSubmit.append('panCardImage', panCardImage);
        if (chequeImage) formDataToSubmit.append('chequeImage', chequeImage);

        formDataToSubmit.append('createdBy', userId);
        formDataToSubmit.append('mainBroker', mainBroker || '');

        try {
            const response = await fetch(`${API_BASE_URL}/api/project/inventory/${inventory._id}/update-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSubmit,
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Inventory marked as Sold.');
                closeForm();
                window.location.reload();
            } else {
                alert(result.message || 'Failed to mark as Sold.');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('Error submitting the form.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 items-center overflow-auto">
            <div className="bg-gray-300 rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-center mb-6">Sale Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Father Name</label>
                            <input
                                type="text"
                                name="guardianName"
                                value={formData.customerInfo.guardianName}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    
                        
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Pan Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.customerInfo.panNumber}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Aadhar Card Number</label>
                            <input
                                type="text"
                                name="aadharCardNumber"
                                value={formData.customerInfo.aadharCardNumber}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.customerInfo.address}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.customerInfo.state}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.customerInfo.country}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Pin</label>
                            <input
                                type="number"
                                name="pin"
                                value={formData.customerInfo.pin}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.customerInfo.email}
                                onChange={handleChange}
                                data-object="customerInfo"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>







                    

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Contact Number</label>
                        <input
                            type="number"
                            name="contactNumber"
                            value={formData.unitDetails.contactNumber}
                            onChange={handleChange}
                            data-object="customerInfo"
                            data-nested
                            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Unit Cost</label>
                            <input
                                type="number"
                                name="unitCost"
                                value={formData.unitDetails.unitCost}
                                onChange={handleChange}
                                data-object="unitDetails"
                                data-nested
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">PAN Card Image</label>
                            <input
                                type="file"
                                name="panCardImage"
                                onChange={handleFileChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700">Cheque Image</label>
                            <input
                                type="file"
                                name="chequeImage"
                                onChange={handleFileChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Broker (optional)</label>
                        <select
                            value={formData.mainBroker}
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    mainBroker: e.target.value, // Update the mainBroker in formData
                                }));
                            }}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select a broker</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>


                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit Sale
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaleForm;


