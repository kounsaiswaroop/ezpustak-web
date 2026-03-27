import { Link } from "wouter";
import { Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ConditionBadge } from "@/components/ConditionBadge";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <img 
            src={`${import.meta.env.BASE_URL}images/empty-cart.png`} 
            alt="Empty Cart" 
            className="w-64 h-64 object-contain opacity-50 mix-blend-multiply mb-8"
          />
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Looks like you haven't added any books yet. Explore our collection and give a book a second life.
          </p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <h3 className="font-semibold text-lg">{items.length} Items</h3>
              <button 
                onClick={clearCart}
                className="text-sm font-medium text-destructive hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.bookId} className="flex gap-6 p-4 rounded-2xl bg-card border border-border shadow-sm">
                  {/* Image */}
                  <Link href={`/book/${item.bookId}`} className="w-24 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border/50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-xs text-center p-2 text-muted-foreground">
                        {item.title}
                      </div>
                    )}
                  </Link>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/book/${item.bookId}`} className="font-display font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.bookId)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">{item.author}</div>
                    
                    <div className="mb-auto">
                      <ConditionBadge condition={item.condition} />
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-input rounded-lg overflow-hidden h-9 bg-background w-28">
                        <button 
                          onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                          className="w-8 flex items-center justify-center hover:bg-muted text-foreground transition-colors"
                        >-</button>
                        <div className="flex-1 text-center font-semibold text-sm">{item.quantity}</div>
                        <button 
                          onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                          className="w-8 flex items-center justify-center hover:bg-muted text-foreground transition-colors"
                        >+</button>
                      </div>
                      
                      <div className="text-lg font-bold text-foreground">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md sticky top-28">
              <h3 className="font-display text-2xl font-bold mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>
              
              <div className="border-t border-border/80 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-3xl text-primary">₹{total}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Inclusive of all taxes</p>
              </div>
              
              <Link href="/checkout" className="block w-full">
                <Button size="lg" className="w-full h-14 text-lg">
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" /> 100% Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
