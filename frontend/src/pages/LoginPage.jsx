import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [userType, setUserType] = useState("admin"); // Default to Admin
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://inventorybackend-bf15.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phoneNumber,
            password: password,
            role: userType,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store token, role, and additional data in localStorage
        localStorage.setItem("token", data.token);

        localStorage.setItem("role", userType);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("assignedProjects", JSON.stringify(data.user.assignedProjects || []));
        localStorage.setItem("visibleFields", JSON.stringify(data.user.visibleFields || []));

        // Redirect based on role
        if (userType === "admin") {
          window.location.href = "/linkpage"; // Redirect to admin sidebar
        } else {
          window.location.href = "/linkpage"; // Redirect to executive home
        }
      } else {
        setErrorMessage(data.message || "Login failed, please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex bg-[#FFFDD0] justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-center font-bold mb-6">ROF Pravasa</h1>
        

        {/* <div className="flex justify-between mb-8 px-8">
          <label className="font-semibold mr-4">
            <input
              type="radio"
              name="userType"
              value="admin"
              checked={userType === "admin"}
              onChange={() => setUserType("admin")}
              className="cursor-pointer mr-2"
            />
            Admin
          </label>
          <label className="font-semibold">
            <input
              type="radio"
              name="userType"
              value="executive"
              checked={userType === "executive"}
              onChange={() => setUserType("executive")}
              className="cursor-pointer mr-2"
            />
            Executive
          </label>
        </div> */}

        {errorMessage && (
          <div className="text-center text-red-500 mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm block font-medium" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 px-4 py-2"
              required
            />
          </div>

          <div className="relative">
            <label className="text-gray-700 text-sm block font-medium" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 absolute right-4 top-10"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-6">
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Select User Type
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
          >
            <option value="admin">HO</option>
            <option value="executive">CP</option>
          </select>
        </div>

          <button
            type="submit"
            className="bg-[#4A4A4A] rounded-md text-white w-full focus:outline-none focus:ring-2 font-semibold hover:bg-gray-700 mt-20 py-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;




