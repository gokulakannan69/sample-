import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function ProjectDetails({ 
  project, 
  onClose,
  onNextProject,
  onPrevProject,
  hasNextProject,
  hasPrevProject
}: { 
  project: any, 
  onClose: () => void,
  onNextProject?: () => void,
  onPrevProject?: () => void,
  hasNextProject?: boolean,
  hasPrevProject?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { damping: 40, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { damping: 40, stiffness: 150 });
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 40, stiffness: 150 });
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), { damping: 40, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  const next = () => setCurrentIndex((p) => Math.min(p + 1, project.images.length - 1));
  const prev = () => setCurrentIndex((p) => Math.max(p - 1, 0));

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={scrollRef}
          data-lenis-prevent="true"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] bg-mg-dark backdrop-blur-3xl overflow-y-auto overflow-x-hidden pointer-events-auto"
        >
          {/* Header / Close */}
          <div className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-10 text-mg-white bg-mg-dark/80 backdrop-blur-md border-b border-mg-gray/5">
            <h2 className="font-serif text-3xl font-light">{project.title}</h2>
            <button onClick={onClose} className="p-4 hover:text-mg-accent-orange hover:scale-110 transition-all">
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* 3D Carousel */}
          <div 
            className="relative h-[60vh] md:h-[75vh] w-full flex items-center justify-center mt-12 md:mt-24 mb-12 md:mb-24 overflow-visible" 
            style={{ perspective: '2400px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{ rotateX, rotateY, x: translateX, y: translateY, transformStyle: "preserve-3d" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
             {project.images.map((img: string, i: number) => {
               const offset = i - currentIndex;
               const isCenter = offset === 0;
               if (Math.abs(offset) > 1) return null; // Only render immediate neighbors
               
               return (
                 <motion.div
                   key={i}
                   drag={isCenter ? "x" : false}
                   dragConstraints={{ left: 0, right: 0 }}
                   dragElastic={0.2}
                   onDragEnd={(e, { offset, velocity }) => {
                     const swipe = swipePower(offset.x, velocity.x);
                     if (swipe < -swipeConfidenceThreshold) {
                       next();
                     } else if (swipe > swipeConfidenceThreshold) {
                       prev();
                     }
                   }}
                   initial={false}
                   animate={{
                     x: offset * 350,
                     scale: isCenter ? 1 : 0.8,
                     rotateY: offset * -45,
                     z: isCenter ? 0 : -300,
                     zIndex: 10 - Math.abs(offset),
                     opacity: 1
                   }}
                   transition={{ 
                     type: "spring",
                     stiffness: 80,
                     damping: 25,
                     mass: 1
                   }}
                   className={`absolute w-[80%] md:w-[60%] lg:w-[50%] aspect-[16/10] ${isCenter ? 'cursor-grab active:cursor-grabbing pointer-events-auto shadow-2xl' : 'cursor-pointer pointer-events-auto'}`}
                   onClick={() => !isCenter && setCurrentIndex(i)}
                   style={{ transformStyle: "preserve-3d" }}
                 >
                   <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.12)] group">
                     <motion.img 
                       src={img} 
                       alt="" 
                       animate={{
                         x: isCenter ? 0 : offset * -20,
                         scale: isCenter ? 1.05 : 1
                       }}
                       transition={{ duration: 1 }}
                       className={`w-full h-full object-cover pointer-events-none transition-all duration-700 ${!isCenter ? 'blur-[6px] brightness-75 grayscale-[0.3]' : 'brightness-105'}`} 
                     />
                     <div className="absolute inset-0 bg-mg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                   </div>
                 </motion.div>
               )
             })}
            </motion.div>

             <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-8 z-20 pointer-events-auto">
               <button onClick={prev} disabled={currentIndex === 0} className="p-4 rounded-full bg-mg-accent/10 backdrop-blur-xl border border-mg-accent/20 disabled:opacity-30 hover:bg-mg-accent/20 transition-colors">
                 <ChevronLeft className="w-6 h-6 text-mg-accent-orange" />
               </button>
               <button onClick={next} disabled={currentIndex === project.images.length - 1} className="p-4 rounded-full bg-mg-accent/10 backdrop-blur-xl border border-mg-accent/20 disabled:opacity-30 hover:bg-mg-accent/20 transition-colors">
                 <ChevronRight className="w-6 h-6 text-mg-accent-orange" />
               </button>
             </div>
          </div>

          {/* Details with scroll animations */}
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-8 block">{project.category}</span>
              <h3 className="text-4xl md:text-6xl font-serif font-light mb-12">Concept & Execution</h3>
              <p className="text-xl md:text-3xl font-serif font-light leading-relaxed mb-24 max-w-4xl text-mg-white/80">
                {project.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 border-t border-mg-gray/20 pt-16">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Location</h4>
                <p className="font-serif text-2xl text-mg-white">{project.location}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Year</h4>
                <p className="font-serif text-2xl text-mg-white">{project.year}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Role</h4>
                <p className="font-serif text-2xl text-mg-white leading-snug">{project.role}</p>
              </motion.div>
            </div>

            {/* Project Navigation */}
            <div className="mt-32 pt-16 border-t border-mg-gray/20 flex justify-between items-center text-mg-white">
              {hasPrevProject ? (
                <button 
                  onClick={onPrevProject}
                  className="group flex items-center gap-4 pointer-events-auto"
                >
                  <ChevronLeft className="w-6 h-6 text-mg-white group-hover:-translate-x-2 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Previous Project</span>
                </button>
              ) : <div />}
              
              {hasNextProject ? (
                <button 
                  onClick={onNextProject}
                  className="group flex items-center gap-4 pointer-events-auto text-right"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Next Project</span>
                  <ChevronRight className="w-6 h-6 text-mg-white group-hover:translate-x-2 transition-transform" />
                </button>
              ) : <div />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
