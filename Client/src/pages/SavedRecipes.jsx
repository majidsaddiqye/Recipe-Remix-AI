import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  LogOut,
  Bookmark,
  ArrowLeft,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    fetchSavedRecipes();
  }, [user?._id]);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/recipes/my-recipes");
      setRecipes(response.data.data || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      toast.error("Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      // Remove from user's savedRecipes array
      await api.delete(`/recipes/remove/${recipeId}`);
      setRecipes(recipes.filter((r) => r._id !== recipeId));
      toast.success("Recipe removed from collection");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error("Failed to remove recipe");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col p-6 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 font-bold text-2xl text-orange-400">
            <Utensils className="h-8 w-8" />
            <span className="tracking-tight">RecipeRemix</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> AI Assistant
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 bg-slate-800 border-none text-white hover:bg-slate-700"
          >
            <Bookmark className="h-4 w-4" /> Saved Recipes
          </Button>
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
              navigate("/login");
            }}
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white lg:ml-72 ml-0 transition-[margin] duration-300 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-orange-500" />
              My Saved Recipes
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="gap-2 hidden md:flex"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {loading ? (
              <div className="max-w-3xl mx-auto text-center py-12">
                <p className="text-slate-500">Loading recipes...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="max-w-3xl mx-auto text-center py-12">
                <Bookmark className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No saved recipes yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Start chatting with AI Chef to save your favorite recipes!
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Go to AI Assistant
                </Button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800">
                        {recipe.title || "Untitled Recipe"}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecipe(recipe._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {recipe.recipeContent ? (
                      <div className="prose prose-sm max-w-none leading-relaxed prose-headings:text-slate-900 prose-strong:text-orange-600 prose-p:text-slate-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {recipe.recipeContent}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recipe.ingredients &&
                          recipe.ingredients.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">
                                Ingredients:
                              </h4>
                              <ul className="list-disc list-inside text-slate-600 space-y-1">
                                {recipe.ingredients.map((ing, idx) => (
                                  <li key={idx}>{ing}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {recipe.instructions &&
                          recipe.instructions.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">
                                Instructions:
                              </h4>
                              <ol className="list-decimal list-inside text-slate-600 space-y-1">
                                {recipe.instructions.map((inst, idx) => (
                                  <li key={idx}>{inst}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                        {recipe.nutrition && (
                          <div className="pt-4 border-t border-slate-200">
                            <h4 className="font-semibold text-slate-800 mb-2">
                              Nutrition:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {recipe.nutrition.calories && (
                                <div>
                                  <span className="text-slate-500">
                                    Calories:
                                  </span>
                                  <span className="ml-2 font-medium text-slate-800">
                                    {recipe.nutrition.calories}
                                  </span>
                                </div>
                              )}
                              {recipe.nutrition.protein && (
                                <div>
                                  <span className="text-slate-500">
                                    Protein:
                                  </span>
                                  <span className="ml-2 font-medium text-slate-800">
                                    {recipe.nutrition.protein}
                                  </span>
                                </div>
                              )}
                              {recipe.nutrition.carbs && (
                                <div>
                                  <span className="text-slate-500">Carbs:</span>
                                  <span className="ml-2 font-medium text-slate-800">
                                    {recipe.nutrition.carbs}
                                  </span>
                                </div>
                              )}
                              {recipe.nutrition.fat && (
                                <div>
                                  <span className="text-slate-500">Fat:</span>
                                  <span className="ml-2 font-medium text-slate-800">
                                    {recipe.nutrition.fat}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {recipe.cuisine && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                          {recipe.cuisine}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
