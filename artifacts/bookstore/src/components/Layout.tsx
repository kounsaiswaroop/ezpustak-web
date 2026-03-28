import { Link, useLocation } from "wouter";
import { BookOpen, ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const cartItemsCount = useCart(state => state.getTotalItems());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-primary group">
              <BookOpen className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                EzPustak<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">Shop Books</Link>
		<a href="https://tally.so/r/WOPZPk" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity">Sell Your Books</a>
              
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search titles, authors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 pl-10 pr-4 rounded-full bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                />
              </form>

              <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/cart" className="relative p-2 text-foreground">
                <ShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-foreground"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent focus:border-primary outline-none"
              />
            </form>
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="p-3 rounded-xl font-medium hover:bg-muted">Home</Link>
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="p-3 rounded-xl font-medium hover:bg-muted">Shop Books</Link>
              <a href="https://tally.so/r/WOPZPk" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="p-3 rounded-xl font-medium hover:bg-muted block">Sell Your Books</a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background/80 pt-16 pb-8 border-t-4 border-primary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 text-background mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <span className="font-display font-bold text-2xl tracking-tight">EzPustak<span className="text-primary">.</span></span>
              </Link>
              <p className="text-background/60 max-w-sm mb-6 leading-relaxed">
                We are a small Indian startup passionate about making books accessible and affordable. Every book deserves a second life. Find your next great read with us.
              </p>
              <div className="text-sm font-medium text-primary">
                Follow us on Instagram @ezpustak
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-lg text-background mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
                <li><Link href="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg text-background mb-4">Store Policies</h4>
              <ul className="space-y-3">
                <li><button className="hover:text-primary transition-colors text-left" href="https://www.notion.so/ezpustak/32f7669560f4802aa4d6f7a141d43222" target="_blank" rel="noopener noreferrer">Return Policy</button></li>
                <li><button className="hover:text-primary transition-colors text-left" href="https://www.notion.so/ezpustak/32f7669560f4802aa4d6f7a141d43222" target="_blank" rel="noopener noreferrer">Privacy Policy</button></li>
                <li><button className="hover:text-primary transition-colors text-left" href="https://www.notion.so/ezpustak/32f7669560f4802aa4d6f7a141d43222" target="_blank" rel="noopener noreferrer">Terms of Service</button></li>
                <li><button className="hover:text-primary transition-colors text-left" href="https://www.notion.so/ezpustak/32f7669560f4802aa4d6f7a141d43222" target="_blank" rel="noopener noreferrer">Shipping Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
            <p>© 2025 EzPustak. All rights reserved.</p>
            <Link href="/admin/login" className="hover:text-background/60">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
