import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAIL } from '@/lib/constants';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 border-b border-border/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 lg:h-32 transition-all duration-500">
          <Link to="/" className="flex items-center">
            <Logo className="h-16 lg:h-24 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="gap-2 rounded-lg border-border/50 text-xs">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-xs text-muted-foreground">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="ml-4 gradient-primary text-white glow-hover text-xs rounded-lg h-9 px-5">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 border-t border-border/50"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.to ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="pt-2 space-y-2">
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="w-full gap-2 rounded-lg" onClick={() => { navigate('/admin'); setIsOpen(false); }}>
                      <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gradient-primary text-white rounded-lg mt-2">Get Started</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
