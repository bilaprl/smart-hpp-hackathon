"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LandingSection from "../components/LandingSection";
import DashboardSection from "../components/DashboardSection";
import HppSection from "../components/HppSection";
import KeuanganSection from "../components/KeuanganSection";
import FaqSection from "../components/FaqSection";
import Modals from "../components/Modals";
import Footer from "../components/Footer";

export default function Home() {
  const [currentView, setCurrentView] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Cek status login dari localStorage (Simulasi Sesi Prototipe)
  useEffect(() => {
    const checkSession = localStorage.getItem("smarthpp_session");
    if (checkSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

 // --- FUNGSI AUTENTIKASI DUMMY (SINKRON DENGAN MODALS.JSX) ---
  const dummyEmail = "user@smarthpp.com";
  const dummyPassword = "demo123456";

  const doLogin = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email.trim() === dummyEmail && password === dummyPassword) {
      setIsLoggedIn(true);
      localStorage.setItem("smarthpp_session", "true"); 
      closeModal();

      navigate("dashboard");
    } else {
      throw new Error(
        `Email atau password salah! Gunakan akun demo: ${dummyEmail} / ${dummyPassword}`,
      );
    }
  };

  const doRegister = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(
      "Berhasil mendaftar (Mode Prototipe)! Silakan masuk dengan akun yang baru dibuat.",
    );
  };

  const doGoogleLogin = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoggedIn(true);
    localStorage.setItem("smarthpp_session", "true");
    closeModal();

    if (currentView === "landing") {
      navigate("dashboard");
    }
  };

  const doLogout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem("smarthpp_session"); // Hapus sesi lokal
    closeModal();
    navigate("landing");
  };

  return (
    <>
      <Navbar
        currentView={currentView}
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        openModal={openModal}
      />

      <main
        className={`flex-grow w-full relative ${currentView === "landing" ? "" : "pt-28 px-4 md:px-8"}`}
      >
        {currentView === "landing" && (
          <LandingSection navigate={navigate} openModal={openModal} />
        )}
        {currentView === "dashboard" && (
          <DashboardSection
            isLoggedIn={isLoggedIn}
            openModal={openModal}
            navigate={navigate}
          />
        )}
        {currentView === "hpp" && (
          <HppSection isLoggedIn={isLoggedIn} openModal={openModal} />
        )}
        {currentView === "keuangan" && (
          <KeuanganSection isLoggedIn={isLoggedIn} openModal={openModal} />
        )}
        {currentView === "faq" && <FaqSection />}
      </main>

      <Footer
        isLoggedIn={isLoggedIn}
        openModal={openModal}
        navigate={navigate}
      />

      <Modals
        activeModal={activeModal}
        closeModal={closeModal}
        doLogin={doLogin}
        doRegister={doRegister}
        doGoogleLogin={doGoogleLogin}
        doLogout={doLogout}
      />
    </>
  );
}
