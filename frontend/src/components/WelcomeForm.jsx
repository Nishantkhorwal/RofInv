import React from "react"

export default function WelcomeLetterForm({ formData, onFormChange, onSendLetter, isLoading }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onFormChange({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.number || !formData.unitNumber || !formData.title) {
      alert('Please fill in all fields')
      return
    }
    onSendLetter()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title + Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Title & Name
          </label>
          <div className="flex gap-2">
            <select
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select title</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
            </select>


            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-[70%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Unit Number */}
        <div>
          <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Number
          </label>
          <input
            type="text"
            id="unitNumber"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unit number"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Welcome Letter'}
        </button>
      </form>
    </div>
  )
}
