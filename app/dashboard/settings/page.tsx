"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { User, Bell, Shield, Key, CreditCard } from "lucide-react";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { useAuth } from "@/context/AuthContext";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isResetting, setIsResetting] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const settingsSections = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "github", name: "GitHub Integration", icon: GithubIcon },
    { id: "billing", name: "Billing & Plans", icon: CreditCard },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "api", name: "API Keys", icon: Key },
  ];

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === section.id
                  ? "bg-[#7C3AED]/20 text-[#A855F7]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.name}
            </button>
          ))}
        </div>

        <GlassCard className="flex-1 p-8">
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">Public Profile</h2>
                <p className="text-sm text-gray-400 mb-6">This information will be displayed publicly.</p>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-linear-to-tr from-[#7C3AED] to-[#22D3EE] p-[2px]">
                    <div className="w-full h-full bg-[#09090B] rounded-full flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-white/50" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                        Upload new
                      </button>
                      <button className="px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">At least 256x256 PNG or JPG.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Display Name</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Developer"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Bio</label>
                    <textarea rows={4} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors resize-none" placeholder="Write a few sentences about yourself..."></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
                <p className="text-sm text-gray-400 mb-6">Manage your password and security options.</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-sm font-medium text-white">Reset Password</h3>
                <p className="text-xs text-gray-400">
                  Send a password reset link to your registered email address ({user?.email}) to securely update your password.
                </p>
                <button
                  onClick={handlePasswordReset}
                  disabled={isResetting}
                  className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isResetting ? "Sending Email..." : "Send Password Reset Email"}
                </button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && activeTab !== "security" && (
            <div className="py-12 text-center text-gray-500">
              Settings tab "{activeTab}" configuration coming soon.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

