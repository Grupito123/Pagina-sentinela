import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1,
  distance = 60,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dirs: Record<string, { x: number; y: number }> = {
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const d = dirs[direction];

    gsap.set(el, { opacity: 0, x: d.x, y: d.y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [direction, delay, duration, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
