import { useState, useEffect } from "react";

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "mobile",
        "phone",
        "tablet",
        "touch",
        "palm",
        "webos",
      ];

      const isMobileDevice = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword),
      );

      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

  return isMobile;
};

export const useDesktopWarning = () => {
  const isMobile = useMobileDetection();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const hasSeenWarning = sessionStorage.getItem("desktop-warning-seen");
      if (!hasSeenWarning) {
        setShowWarning(true);
        sessionStorage.setItem("desktop-warning-seen", "true");
      }
    }
  }, [isMobile]);

  return { showWarning, setShowWarning };
};
