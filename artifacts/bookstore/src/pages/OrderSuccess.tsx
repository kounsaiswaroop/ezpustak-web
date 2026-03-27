import { Link } from "wouter";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('id');

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-background">
        <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center shadow-xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Order Successful!</h1>
            
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you for shopping with EzPustak. Your order has been received and is being processed.
            </p>

            <div className="bg-secondary/40 border border-secondary rounded-2xl p-6 mb-8 text-left flex items-start gap-4">
              <Package className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Order Reference ID</p>
                <p className="font-mono font-bold text-foreground text-lg break-all">
                  {orderId || 'PGT-XXXX-XXXX'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  We've saved these details to process your delivery. You'll receive updates via phone/email shortly.
                </p>
              </div>
            </div>

            <Link href="/shop" className="block">
              <Button size="lg" className="w-full h-14">
                Continue Shopping <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
