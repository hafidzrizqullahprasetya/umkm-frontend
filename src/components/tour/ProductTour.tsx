"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft } from "phosphor-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  highlightPadding?: number;
}

const tourSteps: TourStep[] = [
  {
    target: "body",
    title: "Selamat Datang di Tampung! 👋",
    content: "Platform untuk mendukung UMKM Nagari/Gapura dari seluruh Indonesia. Mari kami tunjukkan fitur-fitur utama!",
    position: "bottom",
  },
  {
    target: '[data-tour="search"]',
    title: "Cari UMKM Favorit 🔍",
    content: "Gunakan fitur pencarian untuk menemukan UMKM berdasarkan nama, deskripsi, atau lokasi yang Anda inginkan.",
    position: "bottom",
  },
  {
    target: '[data-tour="category"]',
    title: "Filter Berdasarkan Kategori 🏷️",
    content: "Pilih kategori untuk menemukan UMKM sesuai dengan jenis produk atau layanan yang Anda cari.",
    position: "bottom",
  },
  {
    target: '[data-tour="location"]',
    title: "Filter Berdasarkan Lokasi 📍",
    content: "Temukan UMKM terdekat dengan memilih provinsi atau kota yang Anda inginkan.",
    position: "bottom",
  },
  {
    target: '[data-tour="umkm-card"]',
    title: "Kartu UMKM 🏪",
    content: "Setiap kartu menampilkan informasi lengkap tentang UMKM. Klik untuk melihat detail lebih lanjut!",
    position: "top",
  },
  {
    target: '[data-tour="profile"]',
    title: "Profil Anda 👤",
    content: "Akses profil Anda, kelola akun, atau logout dari sini. Belum punya akun? Daftar sekarang untuk menikmati fitur lengkap!",
    position: "bottom",
  },
];

export default function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      // Wait for page to fully load
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentStep < tourSteps.length) {
      updateHighlight();
      window.addEventListener("resize", updateHighlight);
      return () => window.removeEventListener("resize", updateHighlight);
    }
  }, [isOpen, currentStep]);

  const updateHighlight = () => {
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;

    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = step.highlightPadding || 8;

      // Highlight style
      setHighlightStyle({
        position: "fixed",
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
        borderRadius: "12px",
        pointerEvents: "none",
        zIndex: 9998,
        transition: "all 0.3s ease",
      });

      // Tooltip position
      const tooltipPosition = calculateTooltipPosition(rect, step.position || "bottom");
      setTooltipStyle(tooltipPosition);

      // Scroll element into view
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (step.target === "body") {
      // For welcome screen, center the tooltip
      setHighlightStyle({});
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10000,
      });
    }
  };

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const spacing = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 200;

    let style: React.CSSProperties = {
      position: "fixed",
      zIndex: 10000,
      maxWidth: `${tooltipWidth}px`,
    };

    switch (position) {
      case "bottom":
        style.top = `${rect.bottom + spacing}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = "translateX(-50%)";
        break;
      case "top":
        style.bottom = `${window.innerHeight - rect.top + spacing}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = "translateX(-50%)";
        break;
      case "left":
        style.top = `${rect.top + rect.height / 2}px`;
        style.right = `${window.innerWidth - rect.left + spacing}px`;
        style.transform = "translateY(-50%)";
        break;
      case "right":
        style.top = `${rect.top + rect.height / 2}px`;
        style.left = `${rect.right + spacing}px`;
        style.transform = "translateY(-50%)";
        break;
    }

    return style;
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Highlight Box */}
      {step.target !== "body" && (
        <div
          style={highlightStyle}
          className="border-4 border-blue-500 shadow-2xl shadow-blue-500/50 animate-pulse-subtle"
        />
      )}

      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 pr-4">{step.title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Close tour"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6 leading-relaxed">{step.content}</p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-blue-500"
                  : index < currentStep
                  ? "w-2 bg-blue-300"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Lewati Tour
          </button>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft size={20} weight="bold" />
                <span>Kembali</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/30"
            >
              <span>{isLastStep ? "Selesai" : "Lanjut"}</span>
              {!isLastStep && <ArrowRight size={20} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
