import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <UtensilsCrossed className="text-orange-500" />
          <span>RecipeRemix<span className="text-orange-500">AI</span></span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}