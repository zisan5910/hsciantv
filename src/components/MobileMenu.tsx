import { BookOpen, FileText, Link as LinkIcon, Facebook, Youtube, MessageCircle, Send, Moon, Sun, Share2, Download, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { usePwaInstall } from '@/hooks/use-pwa-install';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const { isInstalled, installApp } = usePwaInstall();

  const handleShare = async () => {
    const url = window.location.origin;
    const title = 'HSCianTV - শিক্ষামূলক ভিডিও প্ল্যাটফর্ম';
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
    onClose();
  };

  const handleInstall = () => {
    installApp();
    onClose();
  };

  const socialLinks = [
    { href: 'https://facebook.com/hsciantv', icon: Facebook, label: 'Facebook Page', color: 'text-blue-600' },
    { href: 'https://facebook.com/groups/hsciantv', icon: Facebook, label: 'Facebook Group', color: 'text-blue-500' },
    { href: 'https://youtube.com/@hsciantv', icon: Youtube, label: 'YouTube', color: 'text-red-500' },
    { href: 'https://wa.me/+8801234567890', icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    { href: 'https://t.me/hsciantv', icon: Send, label: 'Telegram', color: 'text-blue-400' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-64 p-0">
        <SheetHeader className="p-3 border-b border-border">
          <SheetTitle className="text-left text-sm">মেনু</SheetTitle>
        </SheetHeader>

        <div className="p-3 space-y-3">
          {/* Theme Toggle - Compact */}
          <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="text-xs">{theme === 'dark' ? 'ডার্ক' : 'লাইট'}</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="scale-75"
            />
          </div>

          {/* Quick Actions - Compact Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              <Share2 size={14} />
              <span>শেয়ার</span>
            </button>

            <button
              onClick={handleInstall}
              disabled={isInstalled}
              className={`flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors ${isInstalled ? 'opacity-50' : ''}`}
            >
              {isInstalled ? <Check size={14} /> : <Download size={14} />}
              <span>{isInstalled ? 'ইনস্টল✓' : 'ইনস্টল'}</span>
            </button>
          </div>

          <div className="border-t border-border/50" />

          {/* Navigation - Compact */}
          <div className="space-y-0.5">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              <BookOpen size={14} />
              <span>কোর্সসমূহ</span>
            </Link>

            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              onClick={(e) => { e.preventDefault(); onClose(); }}
            >
              <FileText size={14} />
              <span>ম্যাটেরিয়াল</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              onClick={(e) => { e.preventDefault(); onClose(); }}
            >
              <LinkIcon size={14} />
              <span>PDF ডাউনলোড</span>
            </a>
          </div>

          <div className="border-t border-border/50" />

          {/* Social - Compact Row */}
          <div>
            <p className="text-[10px] text-muted-foreground px-3 mb-1.5">যোগাযোগ</p>
            <div className="flex flex-wrap gap-1 px-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                  onClick={onClose}
                  title={link.label}
                >
                  <link.icon size={16} className={link.color} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
