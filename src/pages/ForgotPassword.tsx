import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pill, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { emailSchema, friendlyAuthError } from "@/lib/authValidation";
import usePageTitle from "@/hooks/usePageTitle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  usePageTitle("Reset password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const result = await resetPassword(parsed.data);
    setLoading(false);
    if (result.success) {
      setSent(true);
      toast.success("Check your email for a reset link.");
    } else {
      toast.error(friendlyAuthError(result.error));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display text-gradient">Prescribto</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              We sent a password reset link to <span className="text-foreground font-medium">{email}</span>.
            </p>
            <Link to="/login">
              <Button variant="outline" className="rounded-xl gap-2"><ArrowLeft className="w-4 h-4" /> Back to sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold font-display mb-2">Forgot password?</h1>
            <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="name@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 rounded-xl ${error ? "border-destructive" : ""}`} />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send reset link"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;