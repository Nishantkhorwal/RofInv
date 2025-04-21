import React, { useEffect, useState } from "react";

const ManagerUserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const activitiesPerPage = 4;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const managerId = user.id;

        const res = await fetch(`${API_BASE_URL}/api/user/getAllUsersActivity`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch activity data");

        const data = await res.json();
        const filteredActivities = data.activities.filter(
          (activity) =>
            activity.user.id === managerId || activity.user.managerId === managerId
        );

        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (activities.length === 0) return <div className="text-center py-10 text-gray-500">No activities found.</div>;
  const filteredByName = activities.filter(({ user }) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredByName.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(filteredByName.length / activitiesPerPage);


  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="max-w-md  mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {currentActivities.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No such employee found.</div>
      ) : (
        currentActivities.map(({ user, activitySummary, soldInventories = [], holdingInventories = [] }) => (
          <>

            <div key={user.id} className="mb-10 bg-white rounded-xl shadow-md p-6 border">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">
                  {user.role === "executive" ? "User" : user.role} • {user.phone}
                </p>

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
          </>
        ))
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                } hover:bg-blue-500 hover:text-white`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerUserActivity;



