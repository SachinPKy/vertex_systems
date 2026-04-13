import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { CONTACT_EMAIL, INSTAGRAM_LINK } from '@/lib/constants';

const Footer = () => (
  <footer className="border-t border-border/50 bg-background py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-base font-bold tracking-tight">Vertex<span className="gradient-text">Systems</span></span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
            Transforming Ideas into Digital Reality. Premium digital services for students and startups.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 tracking-tight">Quick Links</h4>
          <div className="space-y-2.5">
            {[{ to: '/', label: 'Home' }, { to: '/services', label: 'Services' }, { to: '/projects', label: 'Projects' }, { to: '/contact', label: 'Contact' }].map(({ to, label }) => (
              <Link key={to} to={to} className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 tracking-tight">Contact</h4>
          <div className="space-y-2.5">
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" /> <span>{CONTACT_EMAIL}</span>
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-3.5 h-3.5" /> <span>@vertexsystems</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/30 mt-10 pt-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Vertex Systems. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
