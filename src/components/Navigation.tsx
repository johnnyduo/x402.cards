import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const Navigation = () => {
  return (
    <nav className="glass-strong fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-display font-bold gradient-text tracking-wider">
            x402.Cards
          </h1>
          
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Streams
            </NavLink>
            <NavLink
              to="/active"
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Active
            </NavLink>
            <NavLink
              to="/developers"
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              Developers
            </NavLink>
          </div>
        </div>

        <Button
          variant="outline"
          className="font-display tracking-wide border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
};
