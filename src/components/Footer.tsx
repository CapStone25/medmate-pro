import { Link } from "react-router-dom";
import { Pill, Heart } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/medicines", label: "Medicines" },
  { to: "/login", label: "Sign In" },
  { to: "/register", label: "Create Account" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <Pill className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-display text-gradient">RxVault</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Your trusted digital companion for medicine information. Search, discover, and manage prescriptions with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold font-display mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold font-display mb-4 text-foreground">Demo Accounts</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">Admin:</span> admin@rxvault.com
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">User:</span> user@rxvault.com
              </li>
              <li className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">Company:</span> company@rxvault.com
              </li>
              <li className="text-xs text-muted-foreground/60 mt-1 italic">Password: [role]123</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RxVault. All rights reserved.
          </p>
          <motion.p
            className="text-xs text-muted-foreground flex items-center gap-1"
            whileHover={{ scale: 1.02 }}
          >
            Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for better healthcare
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
