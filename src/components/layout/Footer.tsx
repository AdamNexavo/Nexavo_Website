import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/1.svg" 
                alt="Nexavo Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-background/70 max-w-sm">
              Professionele websites en automatiseringen die jouw bedrijf laten groeien. 
              Wij regelen alles — jij focust op ondernemen.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pagina's</h4>
            <ul className="space-y-3 text-background/70">
              <li><Link to="/" className="hover:text-background transition-colors">Homepage</Link></li>
              <li><Link to="/diensten" className="hover:text-background transition-colors">Diensten</Link></li>
              <li><Link to="/projecten" className="hover:text-background transition-colors">Projecten</Link></li>
              <li><Link to="/pakketten" className="hover:text-background transition-colors">Pakketten</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-background/70">
              <li><Link to="/pakketten" className="hover:text-background transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Voorwaarden</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} Nexavo. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-2 text-background/50 text-sm">
            <span>Gemaakt met</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>in Nederland</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
