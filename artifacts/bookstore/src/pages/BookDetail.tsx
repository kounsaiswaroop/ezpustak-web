import { useRoute, Link } from "wouter";
import { useGetBook } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ConditionBadge } from "@/components/ConditionBadge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, Clock } from "lucide-react";
import { useState } from "react";

export default function BookDetail() {
  const [, params] = useRoute("/book/:id");
  const bookId = parseInt(params?.id || "0");
  
  const { data: book, isLoading, isError } = useGetBook(bookId, {
    query: { enabled: !!bookId }
  });

  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 aspect-[3/4] bg-muted rounded-3xl"></div>
        <div className="flex-1 space-y-6 pt-8">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-24 bg-muted rounded w-full"></div>
        </div>
      </div>
    </Layout>
  );

  if (isError || !book) return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-display font-bold mb-4">Book Not Found</h2>
        <p className="text-muted-foreground mb-8">The book you are looking for doesn't exist or has been removed.</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    </Layout>
  );

  const handleAdd = () => {
    addItem(book, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x "${book.title}" added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="bg-secondary/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Books
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Image */}
          <div className="w-full md:w-5/12 lg:w-1/3 flex-shrink-0">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-muted border border-border">
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 p-6 text-center">
                  <span className="font-display text-3xl font-bold text-foreground/40 mb-4">{book.title}</span>
                  <span className="text-foreground/30 font-medium">{book.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {book.categoryName || 'General'}
                </span>
                <ConditionBadge condition={book.condition} />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground">By {book.author}</p>
            </div>

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border/60">
              <span className="text-4xl font-bold text-primary">₹{book.price}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/40">
                  ₹{book.originalPrice}
                </span>
              )}
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md ml-auto">
                  Save {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <div className="prose prose-stone max-w-none mb-10 text-foreground/80 leading-relaxed">
              <p className="whitespace-pre-line">{(book.description || "No description provided for this book.").split(/(https?:\/\/[^\s]+)/g).map((part, i) => /^https?:\/\//.test(part) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{part}</a> : part)}</p>
            </div>

            <div className="mt-auto bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border-2 border-input rounded-xl overflow-hidden h-14 bg-background w-full sm:w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                    disabled={!book.inStock || quantity <= 1}
                  >-</button>
                  <div className="flex-1 text-center font-semibold text-lg">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                    disabled={!book.inStock}
                  >+</button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg" 
                  onClick={handleAdd}
                  disabled={!book.inStock}
                >
                  {book.inStock ? (
                    <>
                      <ShoppingCart className="mr-2 w-5 h-5" /> Add to Cart
                    </>
                  ) : "Out of Stock"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> 
                  <span>Ships in 24 hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> 
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
