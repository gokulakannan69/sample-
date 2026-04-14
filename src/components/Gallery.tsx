import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import ProjectDetails from './ProjectDetails';

const projects = [
  {
    id: 1,
    title: 'Monolith Residence',
    category: 'Architecture & Interior',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=60',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=60'
    ],
    description: 'A contemporary monolith villa that redefines open-concept living. This project features expansive glass facades, custom-crafted marble surfaces, and a seamless flow between indoor and outdoor living spaces. Our work encompassed the entire architectural concept and architectural interior styling.',
    location: 'Bangalore, KA',
    year: '2024',
    role: 'Principal Architecture',
  },
  {
    id: 2,
    title: 'Azure Penthouse',
    category: 'Luxury Interior Design',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=60',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=60'
    ],
    description: 'A high-end residential penthouse focusing on a "warm minimalist" palette. We utilized premium American walnut timber, custom-designed lighting fixtures, and high-performance textiles to create a sophisticated yet inviting atmosphere for urban professionals.',
    location: 'Hosur, TN',
    year: '2023',
    role: 'Interior Architecture & Bespoke FF&E',
  },
  {
    id: 3,
    title: 'Elysium Office Studio',
    category: 'Commercial Interior',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=60',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1497366883944-886915525c50?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=60'
    ],
    description: 'A transformative workspace design that prioritizes employee wellbeing and collaborative flow. The design features biophilic elements, acoustics-optimized planning, and flexible furniture systems to cater to a fast-growing creative team.',
    location: 'Bangalore, KA',
    year: '2023',
    role: 'Workplace Design & Strategy',
  }
];

function ProjectCard({ project, index, onClick }: { project: any, index: number, onClick: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div className={`w-full flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-32 md:mb-48`}>
      <div 
        className={`w-full ${index % 2 === 0 ? 'md:w-[80%]' : 'md:w-[70%]'} cursor-pointer group pointer-events-auto`}
        onClick={onClick}
      >
        <div ref={ref} className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-mg-charcoal rounded-2xl shadow-2xl">
          <motion.img 
            style={{ y }}
            src={project.image} 
            alt={project.title}
            className="absolute inset-0 w-full h-[120%] object-cover -top-[10%] transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-mg-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
        </div>
        <div className="mt-8 flex justify-between items-start">
          <div className="max-w-md">
            <h3 className="font-serif text-2xl md:text-3xl font-light group-hover:text-mg-accent transition-colors duration-300">{project.title}</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-mg-accent mt-2 mb-4">{project.category}</p>
            <p className="text-sm font-light text-mg-muted leading-relaxed">{project.description}</p>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-mg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
            View Project
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ selectedProject, setSelectedProject }: { selectedProject: any, setSelectedProject: (p: any) => void }) {
  const selectedIndex = projects.findIndex(p => p.id === selectedProject?.id);

  return (
    <section id="projects" className="py-24 bg-mg-gray text-mg-white border-t border-white/5">
      <div className="w-full px-6 md:px-12">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={() => setSelectedProject(project)} 
          />
        ))}
      </div>
      <ProjectDetails 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onNextProject={() => setSelectedProject(projects[selectedIndex + 1])}
        onPrevProject={() => setSelectedProject(projects[selectedIndex - 1])}
        hasNextProject={selectedIndex !== -1 && selectedIndex < projects.length - 1}
        hasPrevProject={selectedIndex > 0}
      />
    </section>
  );
}
