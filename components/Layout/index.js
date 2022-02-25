import React, { useState, useEffect } from "react";

import Footer from "components/Footer";

export default function Layout({ children }) {
  return (
    <div className="mx-auto md:max-w-screen-lg xl:max-w-[1320px]">
      <div className="flex-row items-start justify-between md:flex">
        {children}
      </div>
      <Footer />
    </div>
  );
}
