import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Pill className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-gradient">RxVault</span>
          </Link>

          <h1 className="text-3xl font-bold font-display text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin@rxvault.com / admin123</p>
              <p>User: user@rxvault.com / user123</p>
              <p>Company: company@rxvault.com / company123</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center mx-auto mb-8 shadow-glow-accent">
            <Pill className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-bold font-display text-primary-foreground mb-4">Your Health, Simplified</h2>
          <p className="text-primary-foreground/70 max-w-sm">
            Access thousands of medicines, manage prescriptions, and stay informed about your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
