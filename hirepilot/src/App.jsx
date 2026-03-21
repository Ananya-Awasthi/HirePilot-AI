import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Chatbot from "./Chatbot";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Who from "./components/Who";
import Impact from "./components/Impact";
import Tech from "./components/Tech";
import CTA from "./components/CTA";
import ChatButton from "./components/ChatButton";
import Leaderboard from "./pages/leaderboard";  

// 🔥 IMPORT PAGES
import Details from "./pages/Details";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/InterviewSession";

import Dashboard from "./pages/Dashboard";

export default function App() {

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Router>

      <Routes>

        {/* 🏠 LANDING PAGE */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Problem />
              <HowItWorks />
              <Features />
              <Who />
              <Impact />
              <Tech />
              <CTA />

              {/* Chat Button */}
              <ChatButton openChat={() => setChatOpen(true)} />

              {/* Chatbot */}
              <Chatbot open={chatOpen} setOpen={setChatOpen} />
            </>
          }
        />

        {/* 📄 INTERVIEW PAGE */}
        <Route path="/interview" element={<Interview />} />

        {/* 📄 INTERVIEW SESSION PAGE */}
        <Route path="/session" element={<InterviewSession />} />

        {/* 📄 DETAILS PAGE */}
        <Route path="/details" element={<Details />} />

        {/* 📊 DASHBOARD PAGE */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/leaderboard" element={<Leaderboard />} />

      </Routes>

    </Router>
  );
}