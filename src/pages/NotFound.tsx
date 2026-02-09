import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageTitle from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="text-8xl font-bold font-display text-gradient mb-4"
        >
          404
        </motion.div>

        <h1 className="text-2xl font-bold font-display text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button className="gap-2 rounded-xl">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/medicines">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Search className="w-4 h-4" />
              Browse Medicines
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
