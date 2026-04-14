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
          className="fixed inset-0 z-[90] bg-mg-dark/98 backdrop-blur-3xl overflow-y-auto overflow-x-hidden pointer-events-auto"
        >
          {/* Header / Close */}
          <div className="sticky top-0 z-50 flex justify-between items-center p-6 md:p-12 text-mg-white pointer-events-none">
            <h2 className="font-serif text-3xl font-light">{project.title}</h2>
            <button onClick={onClose} className="p-4 pointer-events-auto hover:scale-110 transition-transform">
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* 3D Carousel */}
          <div 
            className="relative h-[50vh] md:h-[70vh] w-full flex items-center justify-center mt-10" 
            style={{ perspective: '1200px' }}
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
               return (
                 <motion.div
                   key={i}
                   drag={isCenter ? "x" : false}
                   dragConstraints={{ left: 0, right: 0 }}
                   dragElastic={1}
                   onDragEnd={(e, { offset, velocity }) => {
                     const swipe = swipePower(offset.x, velocity.x);
                     if (swipe < -swipeConfidenceThreshold) {
                       next();
                     } else if (swipe > swipeConfidenceThreshold) {
                       prev();
                     }
                   }}
                   animate={{
                     x: offset * 250,
                     scale: isCenter ? 1 : 0.85,
                     rotateY: offset * -25,
                     z: isCenter ? 0 : -Math.abs(offset) * 100,
                     zIndex: 10 - Math.abs(offset),
                     opacity: Math.abs(offset) > 1 ? 0 : 1
                   }}
                   transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                   className={`absolute w-[90%] md:w-[70%] max-w-6xl aspect-video ${isCenter ? 'cursor-grab active:cursor-grabbing pointer-events-auto shadow-2xl' : 'cursor-pointer pointer-events-auto opacity-50'}`}
                   onClick={() => !isCenter && setCurrentIndex(i)}
                 >
                   <img src={img} alt="" className="w-full h-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none rounded-sm" />
                 </motion.div>
               )
             })}
            </motion.div>

             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8 z-20 pointer-events-auto">
               <button onClick={prev} disabled={currentIndex === 0} className="p-4 rounded-full bg-mg-white/10 backdrop-blur-xl border border-white/20 disabled:opacity-30 hover:bg-mg-white/20 transition-colors">
                 <ChevronLeft className="w-6 h-6 text-mg-white" />
               </button>
               <button onClick={next} disabled={currentIndex === project.images.length - 1} className="p-4 rounded-full bg-mg-white/10 backdrop-blur-xl border border-white/20 disabled:opacity-30 hover:bg-mg-white/20 transition-colors">
                 <ChevronRight className="w-6 h-6 text-mg-white" />
               </button>
             </div>
          </div>

          {/* Details with scroll animations */}
          <div className="max-w-5xl mx-auto px-6 py-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-8 block">{project.category}</span>
              <h3 className="text-4xl md:text-6xl font-serif font-light mb-12">Concept & Execution</h3>
              <p className="text-xl md:text-3xl font-serif font-light leading-relaxed mb-24 max-w-4xl">
                {project.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Location</h4>
                <p className="font-serif text-2xl">{project.location}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Year</h4>
                <p className="font-serif text-2xl">{project.year}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-mg-muted mb-4">Role</h4>
                <p className="font-serif text-2xl">{project.role}</p>
              </motion.div>
            </div>

            {/* Project Navigation */}
            <div className="mt-32 pt-16 border-t border-white/10 flex justify-between items-center text-mg-white">
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
                  className="group flex items-center gap-4 pointer-events-auto"
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
