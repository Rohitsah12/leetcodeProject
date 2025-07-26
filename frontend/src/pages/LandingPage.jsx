// LandingPage.jsx
import React from "react";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import CompanyMarquee from "../components/Landing/CompanyMarque";
import DashboardCards from "../components/Landing/DashboardCard";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div
      className="bg-black min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <Hero />
      <CompanyMarquee />
      <DashboardCards />
      <Footer />
    </div>
  );
};

export default LandingPage;
