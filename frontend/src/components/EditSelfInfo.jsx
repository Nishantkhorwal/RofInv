import React, { useEffect, useState } from 'react';

const EditSelfInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gstNumber: '',
    reraNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/get`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          const { name, phone, email, gstNumber, reraNumber } = data.user;
          setFormData({ name, phone, email, gstNumber, reraNumber });
        } else {
          setMessage(data.message || 'Failed to load user data.');
        }
      } catch (err) {
        setMessage('An error occurred while loading data.');
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Failed to update.');
      }
    } catch (err) {
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
        setTimeout(() => {
        setMessage('');
        }, 2000);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Update Your Information</h2>
      {message && <p className="text-center mb-4 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'gstNumber', 'reraNumber'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required={field === 'name' || field === 'phone'}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
        >
          {loading ? 'Updating...' : 'Update Info'}
        </button>
      </form>
    </div>
  );
};

export default EditSelfInfo;
