import React, { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Utensils, LogOut, Bookmark, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "@/lib/axios";
import { toast } from "sonner";

const DIETARY_OPTIONS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Keto",
  "Paleo",
  "Dairy-Free",
  "Nut-Free",
  "Low-Carb",
  "Halal",
  "Kosher",
];

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [showDietarySettings, setShowDietarySettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Auto Scroll Logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user?._id) return;
    
    // Load user's dietary preferences
    if (user?.dietaryPreferences) {
      setDietaryPreferences(user.dietaryPreferences);
    }
    
    const loadChatHistory = () => {
      socket.emit("load_history", { userId: user._id });
    };

    socket.connect();
    
    // If already connected, load history immediately
    if (socket.connected) {
      loadChatHistory();
    } else {
      // Otherwise wait for connection
      socket.on("connect", loadChatHistory);
    }

    socket.on("chat_history", (history) => {
      if (Array.isArray(history)) {
        setMessages(history);
      }
    });
    
    socket.on("receive_msg", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat_history");
      socket.off("receive_msg");
      socket.disconnect();
    };
  }, [user?._id]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const msg = { role: "user", content: input };
    setMessages((prev) => [...prev, msg]);
    socket.emit("send_msg", { userId: user._id, text: input });
    setInput("");
  };

  const saveRecipe = async (content) => {
    try {
      // Extract title from markdown content (first heading or first line)
      const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : "Saved Recipe";
      
      // Create a recipe from the chat content
      const recipeData = {
        title: title.substring(0, 100), // Limit title length
        ingredientsHash: `chat-${Date.now()}-${user._id}`, // Unique hash for chat recipes
        ingredients: [],
        instructions: content.split('\n').filter(line => line.trim()),
        nutrition: {},
        cuisine: "",
        recipeContent: content, // Store full markdown content
      };

      const response = await api.post("/recipes/save", { recipeData });
      toast.success("Recipe saved to your collection!");
    } catch (err) {
      console.error("Save recipe error:", err);
      toast.error("Failed to save recipe");
    }
  };

  const handleDietaryPreferenceToggle = (preference) => {
    setDietaryPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const saveDietaryPreferences = async () => {
    try {
      setIsSaving(true);
      const response = await api.put("/auth/dietary-preferences", {
        dietaryPreferences,
      });
      
      // Update local storage with new user data
      const updatedUser = { ...user, dietaryPreferences: response.data.data.user.dietaryPreferences };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Dietary preferences saved!");
      setShowDietarySettings(false);
    } catch (err) {
      console.error("Save dietary preferences error:", err);
      toast.error("Failed to save dietary preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-6 shadow-2xl fixed left-0 top-0 h-full z-20">
        <div className="flex items-center gap-3 font-bold text-2xl mb-10 text-orange-400">
          <Utensils className="h-8 w-8" />
          <span className="tracking-tight">RecipeRemix</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 bg-slate-800 border-none text-white hover:bg-slate-700"
          >
            <Send className="h-4 w-4" /> AI Assistant
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/saved")}
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Bookmark className="h-4 w-4" /> Saved Recipes
          </Button>
          
          {/* Dietary Preferences Section */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={() => setShowDietarySettings(!showDietarySettings)}
              className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Settings className="h-4 w-4" /> Dietary Preferences
            </Button>
            
            {showDietarySettings && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {DIETARY_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(option)}
                      onChange={() => handleDietaryPreferenceToggle(option)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span className="text-slate-300">{option}</span>
                  </label>
                ))}
                <Button
                  onClick={saveDietaryPreferences}
                  disabled={isSaving}
                  size="sm"
                  className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            )}
            
            {/* Show active preferences when collapsed */}
            {!showDietarySettings && dietaryPreferences.length > 0 && (
              <div className="mt-2 px-2">
                <div className="text-xs text-slate-500 mb-1">Active:</div>
                <div className="flex flex-wrap gap-1">
                  {dietaryPreferences.slice(0, 2).map((pref) => (
                    <span
                      key={pref}
                      className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded"
                    >
                      {pref}
                    </span>
                  ))}
                  {dietaryPreferences.length > 2 && (
                    <span className="text-xs text-slate-500">
                      +{dietaryPreferences.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              {user?.username?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user?.username}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {user?.email}
              </span>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white ml-72 overflow-hidden">
        <header className="h-16 border-b flex items-center px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            AI Chef Online
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`group relative p-5 rounded-2xl shadow-sm border ${
                      msg.role === "user"
                        ? "bg-orange-500 text-white border-orange-400 max-w-[80%]"
                        : "bg-slate-50 text-slate-800 border-slate-200 max-w-[90%]"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none leading-relaxed prose-headings:text-slate-900 prose-strong:text-orange-600 prose-p:text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.role === "assistant" && (
                      <Button
                        onClick={() => saveRecipe(msg.content)}
                        size="sm"
                        variant="outline"
                        className="mt-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-700 hover:text-orange-600 border-slate-200"
                      >
                        <Bookmark className="h-3 w-3" /> Save Recipe
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Zone */}
        <div className="p-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3 items-center bg-white border border-slate-200 p-2 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-orange-500 transition-all">
            <Input
              placeholder="E.g. I need a chicken biryani recipe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="border-none focus-visible:ring-0 shadow-none text-base"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-12 w-12 rounded-xl bg-orange-500 hover:bg-orange-600 shrink-0 shadow-orange-200 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
