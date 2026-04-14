import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-32 md:py-48 bg-mg-charcoal text-mg-white relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mg-accent-orange/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-mg-accent">
              Studio
            </span>
          </div>
          <div className="md:col-span-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.2] font-light"
            >
              MG Home Decors is an architecture and interior design studio working across diverse project types internationally. We create spaces that are timeless, functional, and deeply connected to their environment.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16"
            >
              <a href="#projects" className="text-[10px] tracking-[0.2em] uppercase font-medium border-b border-mg-white pb-1 hover:text-mg-accent hover:border-mg-accent transition-colors duration-300 pointer-events-auto">
                View Our Work
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
