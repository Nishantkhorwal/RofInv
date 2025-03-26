import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import InventoryPage from "./pages/Inventory";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import MainPage from "./components/MainPage";
import LinkPage from "./pages/LinkPage";
import Sukoon from "./pages/sukoon";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Route for Both Admin and Executive */}
        <Route
          path="/mainpage"
          element={
            <PrivateRoute allowedRoles={["admin", "executive"]}>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sukoon"
          element={
            <PrivateRoute allowedRoles={["admin", "executive"]}>
              <Sukoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/linkpage"
          element={
            <PrivateRoute allowedRoles={["admin", "executive"]}>
              <LinkPage />
            </PrivateRoute>
          }
        />

        {/* Protected Route for Admin */}
        <Route
          path="/sidebar"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Sidebar />
            </PrivateRoute>
          }
        />

        {/* Protected Route for Executive */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={["executive"]}>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="/inventory/:projectName" element={<InventoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;


