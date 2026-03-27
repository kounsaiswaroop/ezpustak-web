import { useState } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAdmin();
  const { toast } = useToast();
  
  const { mutate: performLogin, isPending } = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    performLogin(
      { data: { password } },
      {
        onSuccess: (res) => {
          if (res.success) {
            login(password);
            setLocation('/admin');
            toast({ title: "Login Successful" });
          } else {
            toast({ title: "Invalid password", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Login failed. Incorrect password.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="bg-card w-full max-w-md rounded-3xl border border-border p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Admin Access</h1>
        <p className="text-muted-foreground mb-8">Enter the master password to manage inventory.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            type="password" 
            placeholder="Enter admin password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="text-center text-lg tracking-widest h-14"
          />
          <Button type="submit" size="lg" className="w-full h-14" isLoading={isPending}>
            Authenticate
          </Button>
        </form>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">← Back to public store</a>
        </div>
      </div>
    </div>
  );
}
