import { Link } from "react-router-dom";
import { Pill, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/medicines", label: t("nav.medicines") },
    { to: "/login", label: t("nav.signIn") },
    { to: "/register", label: t("register.createAccount") },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <Pill className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-display text-gradient">RxVault</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold font-display mb-4 text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RxVault. {t("footer.rights")}
          </p>
          <motion.p className="text-xs text-muted-foreground flex items-center gap-1" whileHover={{ scale: 1.02 }}>
            Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for better healthcare
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
