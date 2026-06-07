"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { auth, googleProvider } from "../../lib/firebase";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode("signin");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeAuthModal]);

  const handleFirebaseError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error("An account with this email already exists.");
          break;
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          toast.error("Invalid email or password.");
          break;
        case 'auth/weak-password':
          toast.error("Password is too weak. Please use at least 6 characters.");
          break;
        case 'auth/popup-closed-by-user':
          break;
        case 'auth/invalid-email':
          toast.error("Please enter a valid email address.");
          break;
        default:
          toast.error("Authentication failed. Please try again.");
          console.error(error);
      }
    } else {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  };

  const handleSocialAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Successfully authenticated!");
      closeAuthModal();
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent! Please check your inbox.");
        setMode("signin");
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
        closeAuthModal();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
        closeAuthModal();
      }
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.15)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(124,58,237,0.5)] mb-6">
                  R
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create an account" : "Reset password"}
                </h2>
                <p className="text-sm text-muted">
                  {mode === "forgot" 
                    ? "Enter your email to receive a reset link."
                    : "Generate professional GitHub READMEs with AI."}
                </p>
              </div>

              {/* Social Login (Hide on forgot password) */}
              {mode !== "forgot" && (
                <>
                  <div className="mb-6">
                    <button
                      onClick={handleSocialAuth}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white py-2.5 rounded-xl font-medium transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-xs font-medium text-muted tracking-wider uppercase">Or continue with email</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                </>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                {mode !== "forgot" && (
                  <div className="space-y-1 relative">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-medium text-muted">Password</label>
                      {mode === "signin" && (
                        <button 
                          type="button" 
                          onClick={() => setMode("forgot")}
                          className="text-xs text-accent hover:text-accent/80 transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted ml-1">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(124,58,237,0.2)] cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === "signin" ? (
                    "Sign In"
                  ) : mode === "signup" ? (
                    "Create Account"
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* Footer Toggles */}
              <div className="mt-6 text-center text-sm text-muted">
                {mode === "signin" ? (
                  <p>
                    Don't have an account?{" "}
                    <button onClick={() => setMode("signup")} className="text-white hover:text-accent font-medium transition-colors cursor-pointer">
                      Sign Up
                    </button>
                  </p>
                ) : mode === "signup" ? (
                  <>
                    <p className="mb-4">
                      Already have an account?{" "}
                      <button onClick={() => setMode("signin")} className="text-white hover:text-accent font-medium transition-colors cursor-pointer">
                        Sign In
                      </button>
                    </p>
                    <p className="text-xs opacity-70">
                      By continuing, you agree to our{" "}
                      <a href="#" className="underline hover:text-white">Terms of Service</a> and{" "}
                      <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                    </p>
                  </>
                ) : (
                  <button onClick={() => setMode("signin")} className="text-white hover:text-accent font-medium transition-colors cursor-pointer">
                    Back to Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
