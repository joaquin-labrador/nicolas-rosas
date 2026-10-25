import { useEffect } from "react";

/** La animación de entrada es un detalle visual, separado del contenido. */
export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal")
        .forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
