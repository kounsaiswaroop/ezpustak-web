import { Link } from "wouter";
import { ArrowRight, BookMarked, Sparkles, ShieldCheck, Truck, Tag, ChevronRight } from "lucide-react";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS: Record<string, string> = {
  "Engineering": "⚙️",
  "Medical": "🏥",
  "School": "🏫",
  "Fiction": "📖",
  "Non-Fiction": "📰",
  "Competitive Exams": "🎯",
  "Commerce": "📊",
  "Science": "🔬",
  "Arts": "🎨",
  "Others": "📚",
  "Academic": "🎓",
};

export default function Home() {
  const { data: books, isLoading: isLoadingBooks } = useListBooks();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  const featuredBooks = books?.slice(0, 8) || [];
  const topCategories = categories?.slice(0, 8) || [];
  const dealsBooks = books?.filter(b => b.originalPrice && b.originalPrice > b.price).slice(0, 4) || [];

  return (
    <Layout>
      {/* Thin announcement strip */}
      <div className="bg-primary text-primary-foreground text-center text-sm py-2 font-medium">
        🚚 Free delivery across India on all orders &nbsp;·&nbsp; Quality verified books
      </div>

      {/* Categories Strip */}
      <section className="bg-background border-b border-border py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground text-base">Shop by Category</h2>
            <Link href="/shop" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoadingCategories ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1,2,3,4,5,6].map(i => <div key={i} className="min-w-16 h-20 bg-muted rounded-xl animate-pulse flex-shrink-0" />)}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {topCategories.map(category => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.id}`}
                  className="flex flex-col items-center gap-2 min-w-16 flex-shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors border-2 border-transparent group-hover:border-primary">
                    {CATEGORY_ICONS[category.name] || "📚"}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground text-center leading-tight group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Deals */}
      {dealsBooks.length > 0 && (
        <section className="py-8 bg-secondary/20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-bold">🔥 TOP DEALS</span>
                <h2 className="font-bold text-foreground text-lg">Best Savings</h2>
              </div>
              <Link href="/shop" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealsBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-foreground text-lg">Recently Added</h2>
              <p className="text-muted-foreground text-sm mt-1">Fresh arrivals to our shelves</p>
            </div>
            <Link href="/shop" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingBooks ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-card rounded-2xl p-4 border border-border h-72 animate-pulse">
                  <div className="w-full h-40 bg-muted rounded-xl mb-3"></div>
                  <div className="h-3 bg-muted w-3/4 rounded mb-2"></div>
                  <div className="h-3 bg-muted w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sell Your Books CTA */}
      <section className="py-10 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-primary-foreground font-bold text-2xl sm:text-3xl mb-3">Have books collecting dust?</h2>
          <p className="text-primary-foreground/80 text-base mb-6">Sell them on EzPustak and earn money from your old books!</p>
          <a href="https://tally.so/r/WOPZPk" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 font-bold px-10 rounded-full">
              Sell Your Books Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* About Us */}
      <section className="py-10 bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                India's Trusted Used Bookstore
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Give great books a <span className="text-primary">second life.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are a small Indian startup passionate about making books accessible and affordable. Every book deserves a second life. Find your next great read at prices that won't burn a hole in your pocket.
              </p>
              <Link href="/shop">
                <Button size="lg">
                  Browse All Books <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-600", title: "Quality Verified", desc: "Every book is inspected before listing" },
                { icon: <Truck className="w-6 h-6" />, color: "bg-blue-100 text-blue-600", title: "Free Delivery", desc: "Pan India delivery on all orders" },
                { icon: <Tag className="w-6 h-6" />, color: "bg-orange-100 text-orange-600", title: "Best Prices", desc: "Up to 70% off compared to new books" },
                { icon: <BookMarked className="w-6 h-6" />, color: "bg-purple-100 text-purple-600", title: "1000+ Titles", desc: "Across all categories and subjects" },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-xl p-4 border border-border">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
