"use client";

import { useEffect } from "react";

export default function ScrollToCurrent() {
  useEffect(() => {
    const el = document.querySelector("[data-current-lesson]");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return null;
}
