import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import type { Book } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { ConditionBadge } from "./ConditionBadge";
import { useToast } from "@/hooks/use-toast";

export function BookCard({ book }: { book: Book }) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    addItem(book);
    toast({
      title: "Added to cart",
      description: `"${book.title}" is now in your cart.`,
    });
  };

  return (
    <Link href={`/book/${book.id}`} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        {book.imageUrl ? (
          <img 
            src={book.imageUrl} 
            alt={book.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-secondary-foreground/40 font-display text-xl px-4 text-center">
            {book.title}
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <ConditionBadge condition={book.condition} />
          {!book.inStock && (
            <span className="bg-foreground/80 backdrop-blur-sm text-background text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">
          {book.categoryName || 'Uncategorized'}
        </div>
        <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{book.author}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-primary">₹{book.price}</div>
            {book.originalPrice && book.originalPrice > book.price && (
              <div className="text-xs text-muted-foreground line-through">₹{book.originalPrice}</div>
            )}
          </div>
          
          <Button 
            size="icon" 
            variant="secondary"
            className="h-10 w-10 rounded-full hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
            disabled={!book.inStock}
            title={book.inStock ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
