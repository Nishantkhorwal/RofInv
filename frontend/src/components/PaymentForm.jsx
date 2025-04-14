import React, { useState } from 'react';

export const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...payment,
    date: payment?.date ? new Date(payment.date).toISOString().split("T")[0] : "",
    nextPaymentDate: payment?.nextPaymentDate
      ? new Date(payment.nextPaymentDate).toISOString().split("T")[0]
      : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isChequeCleared" ? value === "true" : value, // Convert string to boolean
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      chequeNumber: "",
      amount: "",
      bankName: "",
      date: "",
      percentagePaid: 0,
      nextPaymentDate: "",
      remarks: "",
      isChequeCleared: false,
    });
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cheque/UTR Number</label>
          <input
            type="text"
            name="chequeNumber"
            value={formData.chequeNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Next Payment Date</label>
        <input
          type="date"
          name="nextPaymentDate"
          value={formData.nextPaymentDate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border rounded px-3 py-1"
          rows={3}
        />
      </div>

      {/* Dropdown for Payment Status */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Payment Status</label>
        <select
          name="isChequeCleared"
          value={formData.isChequeCleared}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="false">Not Cleared</option>
          <option value="true">Cleared</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Payment
        </button>
      </div>
    </form>
  );
};
