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
import Sukoon from "./pages/Sukoon";
import SpinWheel from "./components/SpinWheel";
import WelcomePortal from "./pages/WelcomePortal";
import WelcomeLetter from "./pages/WelcomeLetter";
import Pravasa from "./pages/Pravasa";
import InsigniaSpin from "./components/InsigniaSpin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/pravasa" element={<Pravasa/>} />
        <Route path="/welcome-portal" element={<WelcomePortal />} />
        <Route path="/spinwheel" element={<SpinWheel />} />
        <Route path="/insigniaSpin" element={<InsigniaSpin />} />

        {/* Protected Route for Both Admin and Executive */}
        <Route
          path="/mainpage"
          element={
            <PrivateRoute allowedRoles={["admin", "executive","manager"]}>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sukoon"
          element={
            <PrivateRoute allowedRoles={["admin", "executive","manager"]}>
              <Sukoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/linkpage"
          element={
            <PrivateRoute allowedRoles={["admin", "executive","manager"]}>
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
            <PrivateRoute allowedRoles={["executive","manager"]}>
              <Home />
            </PrivateRoute>
          }
        />
              <Route
                  path="/letter"
                  element={<WelcomeLetter/>}
                />

        <Route path="/inventory/:projectName" element={<InventoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;


