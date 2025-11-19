"use client";

export const useTour = () => {
  const startTour = () => {
    localStorage.removeItem("hasSeenTour");
    window.location.reload();
  };

  const resetTour = () => {
    localStorage.removeItem("hasSeenTour");
  };

  const hasSeenTour = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("hasSeenTour") === "true";
  };

  return {
    startTour,
    resetTour,
    hasSeenTour,
  };
};
