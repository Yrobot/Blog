import React, { useState, useEffect } from "react";

import Footer from "components/Footer";

export default function Layout({ children, className = "" }) {
  return (
    <div className="mx-auto md:max-w-screen-lg xl:max-w-[1320px] 2xl:max-w-[1460px]">
      <div
        className={`flex-row items-start justify-between xl:flex ${className}`}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
