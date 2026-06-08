"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedStatProps {
  value: number;
  label?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedStat({ value, label, className = "text-4xl font-bold text-white", prefix = "", suffix = "" }: AnimatedStatProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    setHasMounted(true);
    spring.set(value);
  }, [value, spring]);

  if (!hasMounted) {
    return (
      <div>
        <div className={className}>
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        {label && <div className="text-sm text-gray-400 mt-1">{label}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className={`${className} flex items-center`}>
        {prefix && <span>{prefix}</span>}
        <motion.span>{display}</motion.span>
        {suffix && <span>{suffix}</span>}
      </div>
      {label && <div className="text-sm text-gray-400 mt-1">{label}</div>}
    </div>
  );
}
