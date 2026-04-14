/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import About from './components/About';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

export default function App() {
  return (
    <SmoothScroll>
      <main className="bg-mg-dark min-h-screen">
        <Navbar />
        <section id="home" className="relative w-full h-screen overflow-hidden bg-mg-dark">
          <Hero3D />
          <div className="absolute inset-0 flex items-center px-6 md:px-12 pointer-events-none z-10">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="font-sans text-[10px] md:text-[12px] tracking-[0.8em] uppercase text-mg-accent mb-6 block font-medium"
                >
                  Bespoke Spaces
                </motion.span>
                
                <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] flex flex-col gap-2">
                  <motion.span 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Architecture
                  </motion.span>
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-4 ml-12 md:ml-24"
                  >
                    <span className="text-mg-accent italic font-light">&</span>
                    <span className="font-light italic">Interior</span>
                    <span className="font-serif font-medium text-4xl md:text-6xl lg:text-8xl tracking-tight text-mg-white/90">Design</span>
                  </motion.div>
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="mt-12 max-w-md ml-12 md:ml-24 border-l border-mg-accent/30 pl-8"
                >
                  <p className="text-mg-muted text-sm md:text-base font-light leading-relaxed">
                    Crafting timeless environments that merge architectural precision with soulful interior narratives.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        <About />
        <Gallery />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

