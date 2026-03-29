import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { BookCard } from "@/components/BookCard";
import { Filter, Search, X } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();

  // Parse query params manually since wouter's useLocation doesn't provide them parsed
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // API Calls
  const { data: books, isLoading: isLoadingBooks } = useListBooks({
    categoryId: activeCategoryId || undefined,
    search: searchQuery || undefined
  });
  const { data: categories } = useListCategories();

  // Local derived state
  const displayedBooks = books || [];

  const handleCategorySelect = (id: number | null) => {
    setActiveCategoryId(id);
    // Update URL without reloading
    const newUrl = new URL(window.location.href);
    if (id) newUrl.searchParams.set('category', id.toString());
    else newUrl.searchParams.delete('category');
    window.history.pushState({}, '', newUrl);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('search');
    window.history.pushState({}, '', newUrl);
  };

  return (
    <Layout>
      <div className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">The Bookstore</h1>
          <p className="text-background/70 max-w-2xl mx-auto">
            Browse our entire collection. Use the filters below to find exactly what you're looking for.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-28">
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center justify-between p-6 md:hidden">
              <div className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /><h3 className="font-bold text-lg">Filters</h3></div>
              <X className={`w-5 h-5 transition-transform ${isFilterOpen ? '' : 'rotate-45'}`} />
            </button>
            <div className={`p-6 pt-0 md:block md:pt-6 ${isFilterOpen ? 'block' : 'hidden'}`}>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Categories</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategoryId === null
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    All Books
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategoryId === cat.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div></div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow w-full">
          {/* Active Search Indicator */}
          {searchQuery && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-muted-foreground">Showing results for:</span>
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
                <Search className="w-3.5 h-3.5" />
                "{searchQuery}"
                <button onClick={handleSearchClear} className="ml-1 hover:text-primary/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {displayedBooks.length} books
          </div>

          {/* Grid */}
          {isLoadingBooks ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card rounded-2xl p-4 border border-border h-80 animate-pulse"></div>
              ))}
            </div>
          ) : displayedBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {displayedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-3xl py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any books matching your current filters. Try changing categories or clearing your search.
              </p>
              <button
                onClick={() => { handleCategorySelect(null); handleSearchClear(); }}
                className="mt-6 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
