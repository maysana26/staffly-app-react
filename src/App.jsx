import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import ExploreEvents from './Pages/ExploreEvents';
import UserProfile from "./Pages/UserProfile";
import MyEvents from './Pages/MyEvents';
import AdminDashboard from './Pages/AdminDashboard';
import CreateEvent from './Pages/CreateEvent';
import EditEvent from './Pages/EditEvent';
// import ViewEvent from './Pages/ViewEvent'; // IMPORT FIXED: Added missing import to prevent compilation crash
import RegisterEvent from './Pages/RegisterEvent'; // ROUTE FIXED: Connected the registration page view
import AdminHome from './Pages/AdminHome';
import './App.css'

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
        {/* used by RegisterEvent.jsx */}
        <Route path="/explore-events" element={<ExploreEvents />} />
        <Route path="/register-event/:eventId" element={<RegisterEvent />} />

        <Route path="/myevents" element={<MyEvents />} />

        <Route path="/profile" element={<UserProfile />} />

        {/* NESTED ADMIN ROUTES */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<ExploreEvents />} />
        <Route path="/adminhome" element={<AdminHome />} />

        {/* STANDALONE CREATE EVENT ROUTE */}
        <Route path="/admindashboard/createevent" element={<CreateEvent />} />

        {/* <Route path="/admindashboard/viewevent/:id" element={<ViewEvent />} /> */}

        <Route path="/admindashboard/editevent/:id" element={<EditEvent />} />
        <Route path="/test-edit" element={<EditEvent />} />

        {/* 3. Redirect: If the usaer goes to the base URL (/), send them to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 4. Catch-all: If the user types a wrong URL, send them to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App