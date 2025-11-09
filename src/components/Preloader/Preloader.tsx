import React from "react";
import "./Preloader.css";

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <img src="/loader.gif" alt="Loading" className="loader-icon" />
    </div>
  );
};

export default Preloader;
