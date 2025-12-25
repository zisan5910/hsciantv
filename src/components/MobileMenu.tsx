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
      <SheetContent side="right" className="w-72 p-0 bg-background">
        <SheetHeader className="px-4 py-3 border-b border-border/50">
          <SheetTitle className="text-left text-base font-semibold">মেনু</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40 border border-border/30">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              <span className="text-sm font-medium">{theme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড'}</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/30"
            >
              <Share2 size={16} />
              <span>শেয়ার</span>
            </button>

            <button
              onClick={handleInstall}
              disabled={isInstalled}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors border border-border/30 ${
                isInstalled 
                  ? 'text-muted-foreground bg-muted/30 cursor-not-allowed' 
                  : 'text-foreground bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {isInstalled ? <Check size={16} /> : <Download size={16} />}
              <span>{isInstalled ? 'ইনস্টল✓' : 'ইনস্টল'}</span>
            </button>
          </div>

          <div className="border-t border-border/30" />

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <BookOpen size={18} className="text-muted-foreground" />
              <span>কোর্সসমূহ</span>
            </Link>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={(e) => { e.preventDefault(); onClose(); }}
            >
              <FileText size={18} className="text-muted-foreground" />
              <span>ম্যাটেরিয়াল</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={(e) => { e.preventDefault(); onClose(); }}
            >
              <LinkIcon size={18} className="text-muted-foreground" />
              <span>PDF ডাউনলোড</span>
            </a>
          </nav>

          <div className="border-t border-border/30" />

          {/* Social Links */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-2 font-medium">যোগাযোগ করুন</p>
            <div className="flex items-center gap-1 px-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-muted-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}
                  title={link.label}
                >
                  <link.icon size={18} className={link.color} />
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