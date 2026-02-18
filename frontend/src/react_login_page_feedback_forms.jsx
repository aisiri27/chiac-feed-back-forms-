import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function LoginPageWrapper() {
  return (
    // 🔴 PASTE YOUR GOOGLE CLIENT ID BELOW
    <GoogleOAuthProvider clientId="PASTE_YOUR_REAL_GOOGLE_CLIENT_ID_HERE">
      <LoginPage />
    </GoogleOAuthProvider>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dummy login (for manual login option)
  const dummyUser = {
    email: "admin@feedback.com",
    password: "123456",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (email === dummyUser.email && password === dummyUser.password) {
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        alert("Welcome to Feedback Dashboard");
      }, 1000);
    } else {
      setError("Invalid email or password");
    }
  };

  // GOOGLE LOGIN SUCCESS
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);

      console.log("Google User:", decoded);
      setSuccess(`Welcome ${decoded.name}`);

      setTimeout(() => {
        alert(`Welcome ${decoded.name} to Feedback Dashboard`);
        // redirect example
        // window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-2">Feedback Portal</h2>
            <p className="text-center text-gray-500 mb-6">
              Login to create & manage feedback forms
            </p>

            {/* GOOGLE LOGIN */}
            <div className="flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                theme="outline"
              />
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* NORMAL LOGIN */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 pr-10"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm font-medium">{success}</p>
              )}

              <Button className="w-full flex items-center gap-2">
                <LogIn size={18} /> Login
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Demo login: admin@feedback.com / 123456
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
