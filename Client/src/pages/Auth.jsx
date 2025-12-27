import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const location = useLocation();
  const isSignupRoute = location.pathname === "/signup";
  const [isLogin, setIsLogin] = useState(!isSignupRoute);
  const navigate = useNavigate();

  // Dynamic schema: username required for signup, optional for login
  const authSchema = useMemo(() => {
    return z.object({
      username: isLogin 
        ? z.string().min(3).optional()
        : z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    });
  }, [isLogin]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(authSchema),
  });

  // Update isLogin when route changes
  useEffect(() => {
    setIsLogin(!isSignupRoute);
    reset();
  }, [isSignupRoute, reset]);

  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, isLogin ? { email: data.email, password: data.password } : data);
      
      // BACKEND CHECK: Aapka backend { data: { user: ... } } bhej raha hai
      const userData = res.data.data?.user; 
  
      if (userData) {
        toast.success(isLogin ? "Welcome Back!" : "Account Created!");
        
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(userData));
          setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
        } else {
          setIsLogin(true);
          navigate("/login");
        }
      }
    } catch (err) {
      // Backend se 'message' field ko uthayein
      toast.error(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-t-4 border-t-orange-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Enter your credentials to continue" : "Join us to remix your first recipe"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Input {...register("username")} placeholder="Username" />
                  {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                </div>
              )}
              <div className="space-y-1">
                <Input {...register("email")} type="email" placeholder="Email" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Input {...register("password")} type="password" placeholder="Password" />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  reset(); // Clear form when switching between login/signup
                }}
                className="text-sm text-slate-600 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}