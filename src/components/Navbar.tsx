import { useState } from 'react';
import { Menu, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePwaInstall();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-14 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-xl font-bold text-foreground">
            HSCianTV
          </Link>

          <div className="flex items-center gap-2">
            {!isInstalled && (
              <Button
                onClick={installApp}
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </Button>
            )}

            <button
              onClick={() => setIsMenuOpen(true)}
              className="nav-button"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;
