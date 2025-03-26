import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const InventoryPage = () => {
    const { projectName } = useParams();  // Access the project name from the URL
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        panCardImage: null,
        chequeImage: null
    });

    // Function to fetch inventory for the selected project
    const fetchInventory = async () => {
        try {
            const response = await fetch(`https://inventorybackend-bf15.onrender.com/api/project/${projectName}/inventory`);
            const data = await response.json();
            setInventory(data.inventory);  // Set the inventory data in state
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setInventory([]);  // Reset inventory on error
        }
    };

    useEffect(() => {
        fetchInventory();  // Fetch inventory when the component mounts
    }, [projectName]);

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    // Handle Sell button click
    const handleSellClick = (item) => {
        setSelectedItem(item);
    };

    // Handle form submission to hold the item
    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!formData.customerName || !formData.panCardImage || !formData.chequeImage) {
            alert('Please fill in all fields and upload images.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('customerName', formData.customerName);
        formDataToSend.append('panCardImage', formData.panCardImage);
        formDataToSend.append('chequeImage', formData.chequeImage);

        try {
            const response = await fetch(`https://inventorybackend-bf15.onrender.com/api/project/hold/${selectedItem._id}`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                alert('Item successfully placed on hold.');
                setInventory(inventory.map(item => item._id === selectedItem._id ? { ...item, status: 'Hold' } : item));
                setSelectedItem(null);  // Close the form after submission
            } else {
                alert('Error placing item on hold.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="flex flex-col w-full items-center justify-center">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Inventory for {projectName}
                </h1>
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                    {/* Inventory Table */}
                    {inventory.length > 0 ? (
                        <table className="min-w-full mt-4 table-auto">
                            <thead>
                                <tr>
                                    
                                    <th className="px-4 py-2 text-left">Tower</th>
                                    <th className="px-4 py-2 text-left">Unit</th>
                                    <th className="px-4 py-2 text-left">Size (Sq Yard)</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.towerNumber}</td>
                                        <td className="border px-4 py-2">{item.unitNumber}</td>
                                        <td className="border px-4 py-2">{item.size}</td>
                                        <td className="border px-4 py-2">{item.type}</td>
                                        <td className="border px-4 py-2">{item.status}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleSellClick(item)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Sell
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No inventory found for this project.</p>
                    )}
                </div>
            </div>

            {/* Sell Form Modal */}
            {selectedItem && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
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
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">PAN Card Image</label>
                                <input
                                    type="file"
                                    name="panCardImage"
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Cheque Image</label>
                                <input
                                    type="file"
                                    name="chequeImage"
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Place on Hold
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;

