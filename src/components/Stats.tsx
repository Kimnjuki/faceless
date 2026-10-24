import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "New creator ventures that are faceless (2026)", value: 38, suffix: "%" },
  { label: "YouTube 2025 ad revenue", value: 40, suffix: "B+", prefix: "$" },
  { label: "Faceless publish frequency vs. face-based", value: 4, suffix: "x" },
  { label: "Faster Year-1 subscriber growth", value: 28, suffix: "%" }
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
