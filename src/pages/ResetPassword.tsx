import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pill, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { passwordSchema, friendlyAuthError } from "@/lib/authValidation";
import { supabase } from "@/integrations/supabase/client";
import usePageTitle from "@/hooks/usePageTitle";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  usePageTitle("Set new password");

  useEffect(() => {
    // Supabase puts the recovery token in URL hash and triggers a PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    const result = await updatePassword(parsed.data);
    setLoading(false);
    if (result.success) {
      toast.success("Password updated. You're signed in.");
      navigate("/");
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

        <h1 className="text-3xl font-bold font-display mb-2">Set a new password</h1>
        <p className="text-muted-foreground mb-8">Choose a strong password you haven't used before.</p>

        {!ready ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Verifying reset link…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-12 rounded-xl" />
              {confirm.length > 0 && password === confirm && (
                <p className="text-xs text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : "Update password"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;