export default function Footer() {
  return (
    <footer className="bg-mg-dark text-mg-white py-24 border-t border-mg-gray relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-mg-accent-orange to-transparent opacity-30"></div>
      <div className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-12">MG Home Decors</h2>
          <a href="mailto:hello@mghomedecors.com" className="text-[10px] tracking-[0.2em] uppercase hover:text-mg-accent-orange transition-colors block mb-4 pointer-events-auto">hello@mghomedecors.com</a>
          <a href="tel:+1234567890" className="text-[10px] tracking-[0.2em] uppercase hover:text-mg-accent-orange transition-colors block pointer-events-auto">+1 (234) 567-890</a>
        </div>
        <div className="flex flex-col md:items-end justify-between">
          <div className="flex gap-8 text-[10px] tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-mg-accent-orange transition-colors pointer-events-auto">Instagram</a>
            <a href="#" className="hover:text-mg-accent-orange transition-colors pointer-events-auto">LinkedIn</a>
            <a href="#" className="hover:text-mg-accent-orange transition-colors pointer-events-auto">Pinterest</a>
          </div>
          <div className="mt-24 text-[10px] tracking-[0.2em] uppercase opacity-50">
            &copy; {new Date().getFullYear()} MG Home Decors
          </div>
        </div>
      </div>
    </footer>
  );
}
