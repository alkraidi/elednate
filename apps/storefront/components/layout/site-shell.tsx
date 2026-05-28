import { AnnouncementBar } from './announcement-bar';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
