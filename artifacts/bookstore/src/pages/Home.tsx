import { Link } from "wouter";
import { ArrowRight, BookMarked, Sparkles, ShieldCheck } from "lucide-react";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: books, isLoading: isLoadingBooks } = useListBooks();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  const featuredBooks = books?.slice(0, 8) || [];
  const topCategories = categories?.slice(0, 6) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>India's Trusted Used Bookstore</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6">
                Give great books a <span className="text-primary relative whitespace-nowrap">
                  second life.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none"/></svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover pre-loved books at affordable prices. Curated selection, strict quality checks, and delivered across India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/shop?category=fiction">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                    Browse Fiction
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 text-sm font-medium text-foreground/80">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span>Quality Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <span>1000+ Titles</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] transform rotate-3"></div>
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
                alt="Cozy bookstore illustration" 
                className="relative rounded-[2rem] shadow-2xl object-cover border-4 border-background z-10 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold mb-3">Browse by Category</h2>
              <p className="text-muted-foreground">Find exactly what you're looking for</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1,2,3,4,5].map(i => <div key={i} className="min-w-32 h-16 bg-muted rounded-xl animate-pulse flex-shrink-0" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {topCategories.map(category => (
                <Link 
                  key={category.id} 
                  href={`/shop?category=${category.id}`}
                  className="px-6 py-4 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md font-medium text-center flex-grow sm:flex-grow-0"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold mb-3">Recently Added</h2>
              <p className="text-muted-foreground">Fresh arrivals to our shelves</p>
            </div>
            <Link href="/shop" className="text-primary font-semibold hover:underline">
              Shop All
            </Link>
          </div>

          {isLoadingBooks ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-card rounded-2xl p-4 border border-border h-80 animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-xl mb-4"></div>
                  <div className="h-4 bg-muted w-3/4 rounded mb-2"></div>
                  <div className="h-4 bg-muted w-1/2 rounded"></div>
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
    </Layout>
  );
}
