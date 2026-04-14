import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Studio', href: '#about' },
    { name: 'Expertise', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-6xl z-50 text-mg-white py-4 px-8 pointer-events-none glass rounded-full"
      >
        <div className="w-full flex items-center justify-between">
          <a href="#" className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium pointer-events-auto hover:text-mg-accent-orange transition-colors duration-300">
            MG Home Decors
          </a>

          <button
            className="group flex items-center gap-4 pointer-events-auto relative z-[110]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hidden md:block text-[10px] tracking-[0.2em] uppercase font-medium group-hover:text-mg-accent-orange transition-colors duration-300">
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </span>
            <div className="w-10 h-10 flex items-center justify-center border border-mg-white/20 rounded-full group-hover:border-mg-accent-orange transition-colors duration-300">
              <div className="relative w-4 h-3 flex flex-col justify-between items-center">
                <motion.span 
                  className="w-full h-px bg-mg-white group-hover:bg-mg-accent-orange block" 
                  animate={isMobileMenuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="w-full h-px bg-mg-white group-hover:bg-mg-accent-orange block" 
                  animate={isMobileMenuOpen ? { x: -20, opacity: 0 } : { x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="w-full h-px bg-mg-white group-hover:bg-mg-accent-orange block" 
                  animate={isMobileMenuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-mg-dark/98 backdrop-blur-3xl text-mg-white flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-5xl md:text-7xl font-light hover:text-mg-accent-orange hover:scale-105 transition-all duration-500"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
