import { Link } from "react-router-dom";
import { Pill, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Pill className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-display text-gradient">RxVault</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted digital companion for medicine information. Search, discover, and manage prescriptions with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold font-display mb-3 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/medicines" className="text-sm text-muted-foreground hover:text-primary transition-colors">Medicines</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold font-display mb-3 text-foreground">Accounts</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Admin: admin@rxvault.com</li>
              <li className="text-sm text-muted-foreground">User: user@rxvault.com</li>
              <li className="text-sm text-muted-foreground">Company: company@rxvault.com</li>
              <li className="text-xs text-muted-foreground/60 mt-1">Password: [role]123</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 RxVault. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
