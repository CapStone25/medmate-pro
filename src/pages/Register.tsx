import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import usePageTitle from "@/hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import { registerSchema, friendlyAuthError } from "@/lib/authValidation";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  usePageTitle(t("register.createAccount"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const fieldErrors: { name?: string; email?: string; password?: string } = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as "name" | "email" | "password";
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    const result = await register(parsed.data.name, parsed.data.email, parsed.data.password);
    if (result.success) {
      toast.success(t("register.success"));
      navigate("/");
    } else {
      toast.error(friendlyAuthError(result.error));
    }
    setLoading(false);
  };

  const pwChecks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];

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
          <h2 className="text-3xl font-bold font-display text-primary-foreground mb-4">{t("login.heroTitle")}</h2>
          <p className="text-primary-foreground/70 max-w-sm">{t("login.heroDesc")}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Pill className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold font-display text-gradient">Prescribto</span>
          </Link>

          <h1 className="text-3xl font-bold font-display text-foreground mb-2">{t("register.createAccount")}</h1>
          <p className="text-muted-foreground mb-8">{t("register.joinUs")}</p>

          <GoogleSignInButton />
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t("register.fullName")}</Label>
              <Input id="name" autoComplete="name" placeholder="Enter your name" value={name}
                onChange={e => setName(e.target.value)} aria-invalid={!!errors.name}
                className={`h-12 rounded-xl ${errors.name ? "border-destructive" : ""}`} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("register.email")}</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email}
                onChange={e => setEmail(e.target.value)} aria-invalid={!!errors.email}
                className={`h-12 rounded-xl ${errors.email ? "border-destructive" : ""}`} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("register.password")}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                  placeholder="Create a strong password" value={password}
                  onChange={e => setPassword(e.target.value)} aria-invalid={!!errors.password}
                  className={`h-12 rounded-xl pr-12 ${errors.password ? "border-destructive" : ""}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              {password.length > 0 && (
                <ul className="text-xs space-y-1 mt-2">
                  {pwChecks.map((c) => (
                    <li key={c.label} className={`flex items-center gap-1.5 ${c.ok ? "text-primary" : "text-muted-foreground"}`}>
                      <Check className={`w-3 h-3 ${c.ok ? "opacity-100" : "opacity-30"}`} /> {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-base gap-2 group" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t("register.creating")}</>
              ) : (
                <>{t("register.createAccount")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("register.haveAccount")}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">{t("register.signIn")}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
