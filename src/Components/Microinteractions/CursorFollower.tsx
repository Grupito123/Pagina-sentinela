import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-hover]")) setHovering(true);
    };
    const onLeave = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-hover]")) setHovering(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full border-2 border-[color-mix(in_srgb,var(--error)_60%,transparent)] mix-blend-difference md:block"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: clicking ? 0.8 : hovering ? 1.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
        style={{ width: 40, height: 40 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full bg-[var(--error)] mix-blend-difference md:block"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: clicking ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{ width: 8, height: 8 }}
      />
    </>
  );
}
