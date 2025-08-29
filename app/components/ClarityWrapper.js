"use client";

import { useEffect, useState } from "react";

const ClarityWrapper = ({ children }) => {
    const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "all") {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        t.onload = () => console.log("Clarity script injected");
        setShowBadge(true);
        setTimeout(() => setShowBadge(false), 5000);
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "r7kr52kudt");
    }
  }, []);
 return (
    <>
      {children}
      {showBadge && (
        <div className="fixed bottom-3 left-3 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm z-50">
          Analytics Enabled
        </div>
      )}
    </>
  );
};

export default ClarityWrapper;
