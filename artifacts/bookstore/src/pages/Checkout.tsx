import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, Link } from "wouter";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotalPrice, clearCart } = useCart();
  const totalAmount = getTotalPrice();
  const { toast } = useToast();

  const { mutate: placeOrder, isPending } = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  });

  // Redirect to cart if empty
  if (items.length === 0) {
    setLocation('/cart');
    return null;
  }

  const onSubmit = (data: CheckoutFormData) => {
    placeOrder({
      data: {
        ...data,
        totalAmount,
        items: items.map(item => ({
          bookId: item.bookId,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity
        }))
      }
    }, {
      onSuccess: (res) => {
        clearCart();
        setLocation(`/order-success?id=${res.orderId}`);
      },
      onError: (err) => {
        toast({
          title: "Order Failed",
          description: err.error?.error || "Could not process order. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-secondary/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12">
          
          {/* Form */}
          <div className="flex-1 space-y-8">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span> 
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input {...register("customerName")} error={!!errors.customerName} placeholder="Jane Doe" />
                  {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...register("email")} type="email" error={!!errors.email} placeholder="jane@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input {...register("phone")} error={!!errors.phone} placeholder="+91 9876543210" />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span> 
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address Line 1</label>
                  <Input {...register("addressLine1")} error={!!errors.addressLine1} placeholder="House/Flat No., Street Name" />
                  {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                  <Input {...register("addressLine2")} placeholder="Landmark, Area" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input {...register("city")} error={!!errors.city} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input {...register("state")} error={!!errors.state} />
                  {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <Input {...register("pincode")} error={!!errors.pincode} />
                  {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2 mt-4">
                  <label className="text-sm font-medium">Delivery Notes (Optional)</label>
                  <textarea 
                    {...register("notes")} 
                    className="flex min-h-[80px] w-full rounded-xl border-2 border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                    placeholder="Leave at the door, call before arriving, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-md sticky top-28">
              <h3 className="font-bold text-lg mb-4 pb-4 border-b border-border">Order Items</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.bookId} className="flex gap-3 text-sm">
                    <div className="flex-1 font-medium leading-tight text-foreground">
                      {item.quantity}x {item.title}
                    </div>
                    <div className="font-semibold">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-border/80">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-8 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-display font-bold text-2xl text-primary">₹{totalAmount}</span>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg mb-4" 
                isLoading={isPending}
              >
                {isPending ? "Processing..." : "Place Order"}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
                Your information is safely stored for delivery.
              </div>
            </div>
          </div>

        </form>
      </div>
    </Layout>
  );
}
