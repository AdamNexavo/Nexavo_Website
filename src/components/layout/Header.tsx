import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { label: "Diensten", href: "/diensten" },
  { label: "Projecten", href: "/projecten" },
  { label: "Pakketten", href: "/pakketten" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container flex items-center justify-between h-20">
        {/* Logo - Left corner */}
        <Link 
          to="/" 
          className="flex items-center gap-2 absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 transition-all duration-300"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div className="h-10 w-auto relative">
            {/* Original logo icon - met gradient voor overgang van donker naar licht */}
            <img 
              src="/2.svg" 
              alt="Nexavo Logo" 
              className="h-10 w-auto transition-all duration-300"
              style={{
                filter: isLogoHovered ? 'brightness(0) invert(1)' : 'none',
                clipPath: 'polygon(0% 0%, 28% 0%, 28% 100%, 0% 100%)',
                opacity: isLogoHovered ? 0.7 : 1,
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 90%, transparent 100%)'
              }}
            />
            {/* White text overlay - wit standaard, blijft wit bij hover */}
            <img 
              src="/2.svg" 
              alt="Nexavo Logo Text" 
              className="h-10 w-auto absolute top-0 left-0 transition-all duration-300"
              style={{
                filter: 'brightness(0) invert(1)',
                opacity: isLogoHovered ? 0.7 : 1,
                clipPath: 'polygon(28% 0%, 100% 0%, 100% 100%, 28% 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === item.href
                  ? "text-white"
                  : "text-white/70 hover:text-[#6a50ff]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button - Right top corner */}
        <Link to="/contact" className="hidden lg:block absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 mt-2">
          <Button variant="secondary" size="default" className="bg-white/10 hover:bg-[#6a50ff] text-white border-white/20 hover:border-[#6a50ff] rounded-lg px-6 py-2.5 text-base">
            Contact
          </Button>
        </Link>
        
        {/* Mobile Menu */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10"
          >
            <nav className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className="text-base font-medium text-white/70 hover:text-white transition-colors py-2"
                  activeClassName="text-white font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                    Contact
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
