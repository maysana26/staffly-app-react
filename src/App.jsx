import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import ExploreEvents from './Pages/ExploreEvents';
import UserProfile from "./Pages/UserProfile"; // 1. Import it at the top
import './App.css'
import MyEvents from './Pages/MyEvents';
import AdminDashboard from './Pages/AdminDashboard';
import CreateEvent from './Pages/CreateEvent';
import EditEvent from './Pages/EditEvent';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        {/* 1. The Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 2. The Signup Page */}
        <Route path="/signup" element={<Signup />} />


        <Route path="/events" element={<ExploreEvents />} />


        <Route path="/myevents" element={<MyEvents />} />


        <Route path="/profile" element={<UserProfile />} />
        {/* NESTED ADMIN ROUTES */}
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* STANDALONE CREATE EVENT ROUTE (Moved outside the block!) */}
        <Route path="/admindashboard/createevent" element={<CreateEvent />} />

        <Route path="/admindashboard/viewevent/:id" element={<ViewEvent />} />
        {/* Add this temporary route right underneath your original one */}
        <Route path="/admindashboard/editevent/:id" element={<EditEvent />} />
        <Route path="/test-edit" element={<EditEvent />} /> {/* <-- TEMPORARY VIEW PATH */}

        {/* 3. Redirect: If the user goes to the base URL (/), send them to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 4. Catch-all: If the user types a wrong URL, send them to Login */}
        <Route path="*" element={<Navigate to="/login" />} />











        {/* 3. Redirect: If the user goes to the base URL (/), send them to Login */}
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}

        {/* 4. Catch-all: If the user types a wrong URL, send them to Login */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  )
}

export default App
