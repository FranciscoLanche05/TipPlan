import { useEffect, useState } from "react";

export default function useProgress(trigger, duration = 800) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let raf;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, duration]);

  return progress;
}