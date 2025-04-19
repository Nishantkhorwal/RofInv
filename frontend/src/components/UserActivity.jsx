import React, { useEffect, useState } from "react";
import ReactSelect from 'react-select'

const UserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState("");

  const usersPerPage = 5;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        const transformedUsers = json.users.map((user) => ({
          ...user,
          id: user._id,
        }));
        setUsers(transformedUsers || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getAllUsersActivity`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setActivities(json.activities || []);
      } catch (error) {
        console.error("Error fetching all user activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchActivities();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1); // 🔁 Reset page on user change

    if (selectedUser) {
      setFilteredActivities(
        activities.filter((activity) => activity.user.id === selectedUser)
      );
    } else {
      setFilteredActivities(activities);
    }
  }, [selectedUser, activities]);
  const brokerOptions = [
    { value: "", label: "All Brokers" },
    ...users.map((user) => ({ value: user._id, label: user.name })),
  ];

  // Set selected broker
  const selectedBroker = brokerOptions.find(
    (option) => option.value === selectedBrokerFilter
  );

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredActivities.length / usersPerPage);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center">
          <ReactSelect
  id="user-select"
  value={brokerOptions.find(option => option.value === selectedUser) || null}
  onChange={(selectedOption) => setSelectedUser(selectedOption?.value || "")}
  options={brokerOptions}
  className="w-full max-w-[20rem]"
  styles={{
    menuList: (provided) => ({
      ...provided,
      maxHeight: '15rem',
      overflowY: 'auto',
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: 'none',
    }),
  }}
/>


        </div>
      </div>

      {/* User Activity Display */}
      {paginatedActivities.length > 0 ? (
        paginatedActivities.map(({ user, activitySummary, soldInventories, holdingInventories }) => (
          <div key={user.id} className="mb-10 bg-white rounded-xl shadow-md p-6 border">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role} • {user.phone}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xl font-bold">{activitySummary.totalSaleRequests}</p>
                <p className="text-sm text-gray-600">Total Sale Requests</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xl font-bold text-green-600">{activitySummary.soldCount}</p>
                <p className="text-sm text-gray-600">Sold Inventories</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-xl font-bold text-yellow-600">{activitySummary.holdingCount}</p>
                <p className="text-sm text-gray-600">On Hold</p>
              </div>
            </div>

            {/* Sold Inventories */}
            <h3 className="text-lg font-semibold text-green-700 mb-2">Sold Inventories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {soldInventories.length ? soldInventories.map((item) => (
                <div key={item.saleRequestId} className="border border-green-300 rounded-md p-4">
                  <p className="text-sm"><span className="font-medium">Type:</span> {item.inventory?.type}</p>
                  <p className="text-sm"><span className="font-medium">Unit:</span> {item.inventory?.unitNumber}</p>
                  <p className="text-sm"><span className="font-medium">Floor:</span> {item.inventory?.floor}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span> {item.inventory?.status}</p>
                  <p className="text-xs text-gray-500 mt-1">Approved: {new Date(item.approvedAt).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-sm text-gray-400">No sold inventories.</p>}
            </div>

            {/* Holding Inventories */}
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Holding Inventories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {holdingInventories.length ? holdingInventories.map((item) => (
                <div key={item.saleRequestId} className="border border-yellow-300 rounded-md p-4">
                  <p className="text-sm"><span className="font-medium">Type:</span> {item.inventory?.type}</p>
                  <p className="text-sm"><span className="font-medium">Unit:</span> {item.inventory?.unitNumber}</p>
                  <p className="text-sm"><span className="font-medium">Floor:</span> {item.inventory?.floor}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span> {item.inventory?.status}</p>
                  <p className="text-xs text-gray-500 mt-1">Held: {new Date(item.heldAt).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-sm text-gray-400">No holding inventories.</p>}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">No activities for this user.</div>
      )}

      {/* Pagination Controls */}
      {filteredActivities.length > usersPerPage && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActivity;
