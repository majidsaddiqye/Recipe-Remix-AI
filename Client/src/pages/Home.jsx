import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Globe, 
  MessageCircle, 
  Bookmark, 
  Clock,
  Brain,
  Utensils
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const features = [
  { 
    icon: <MessageCircle className="w-6 h-6" />, 
    title: "Real-time AI Chat", 
    desc: "Chat naturally with AI Chef in your preferred language. Get instant recipe suggestions and cooking tips through real-time conversation." 
  },
  { 
    icon: <Zap className="w-6 h-6" />, 
    title: "Instant Recipe Generation", 
    desc: "Turn any ingredients into gourmet meals. Just tell AI Chef what you have, and get professional recipes instantly powered by GPT-4o-mini." 
  },
  { 
    icon: <Bookmark className="w-6 h-6" />, 
    title: "Save Your Favorites", 
    desc: "Bookmark your favorite recipes and access them anytime. Build your personal recipe collection with one click." 
  },
  { 
    icon: <Clock className="w-6 h-6" />, 
    title: "Persistent Chat History", 
    desc: "Your conversations are saved automatically. Resume your cooking journey exactly where you left off, even after logging out." 
  },
  { 
    icon: <Globe className="w-6 h-6" />, 
    title: "Global Cuisines", 
    desc: "Explore flavors from across the world. Get authentic recipes from Italian, Indian, Chinese, Mexican, and more cuisines." 
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Smart Dietary Support", 
    desc: "Get personalized recipes based on your dietary preferences. Vegan, gluten-free, keto, or any custom requirements." 
  },
];

export default function Home() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Powered by GPT-4o-mini AI
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Cook Smarter with{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-600 leading-8 max-w-2xl mx-auto"
          >
            RecipeRemix AI helps you create perfect recipes from whatever is in your fridge. 
            Chat naturally with AI Chef and get professional culinary results instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="h-12 px-8 bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
            >
              {user ? "Go to Dashboard" : "Get Started Free"} 
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/login")}
                className="h-12 px-8 border-2"
              >
                Sign In
              </Button>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div>
              <div className="text-3xl font-bold text-slate-900">100+</div>
              <div className="text-sm text-slate-500 mt-1">Recipes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <div className="text-sm text-slate-500 mt-1">AI Assistant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">50+</div>
              <div className="text-sm text-slate-500 mt-1">Cuisines</div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Cook Better
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make cooking easier, faster, and more enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-orange-300 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-br from-orange-50 to-slate-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Sign Up Free", desc: "Create your account in seconds. No credit card required." },
              { step: "2", title: "Chat with AI Chef", desc: "Ask for recipes in your language. Get instant, personalized suggestions." },
              { step: "3", title: "Cook & Save", desc: "Follow the recipes and save your favorites for later." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
            <Utensils className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of home cooks who are already using AI to create amazing meals
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="h-12 px-8 bg-white text-orange-600 hover:bg-slate-100 shadow-lg"
            >
              {user ? "Continue Cooking" : "Start Cooking Now"}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}