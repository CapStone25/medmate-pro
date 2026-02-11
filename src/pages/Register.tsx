import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import usePageTitle from "@/hooks/usePageTitle";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  usePageTitle("Create Account");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="relative z-10 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center mx-auto mb-8 shadow-glow-accent">
            <Pill className="w-12 h-12 text-accent-foreground" />
          </motion.div>
          <h2 className="text-3xl font-bold font-display text-primary-foreground mb-4">Join RxVault Today</h2>
          <p className="text-primary-foreground/70 max-w-sm">
            Create your account and start exploring our comprehensive medicine database.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Pill className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold font-display text-gradient">RxVault</span>
          </Link>

          <h1 className="text-3xl font-bold font-display text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground mb-8">Sign up as a patient to get started</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" value={name}
                onChange={e => setName(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 chars)" value={password}
                  onChange={e => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2 group" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Company accounts are created by administrators.{" "}
            <Link to="/login" className="text-primary hover:underline">Contact us</Link> if you represent a pharmaceutical company.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
