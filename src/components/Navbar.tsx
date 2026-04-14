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
          <a href="#" className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium pointer-events-auto hover:text-mg-accent transition-colors duration-300">
            MG Home Decors
          </a>

          <button
            className="text-[10px] tracking-[0.2em] uppercase font-medium hover:text-mg-accent hover:border-mg-accent transition-colors duration-300 pointer-events-auto border border-mg-white/20 px-6 py-2 rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            Menu
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
            className="fixed inset-0 z-[100] bg-mg-dark/95 backdrop-blur-3xl text-mg-white flex flex-col justify-center items-center"
          >
            <button
              className="absolute top-8 right-6 md:right-12 text-[10px] tracking-[0.2em] uppercase font-medium hover:text-mg-accent transition-colors duration-300 border border-mg-white/20 px-6 py-2 rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Close
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-5xl md:text-7xl font-light hover:text-mg-accent hover:scale-105 transition-all duration-500"
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
