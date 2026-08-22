import { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  strength = 0.3,
  className = "",
  style,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * strength, y: y * strength });
  };

  return (
    <motion.button
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}
