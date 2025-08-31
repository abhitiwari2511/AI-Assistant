import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface AuthProps {
  mode: "signin" | "signup";
}

import { useAuthHandler } from "@/hooks/useAuth";

const Auth = ({ mode }: AuthProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const isSignUp = mode === "signup";
  const { loading, handleAuth } = useAuthHandler({ mode });

  return (
    <div>
      <Card className="w-[18.5rem] max-w-md">
        <CardHeader>
          <CardTitle>
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your credentials to register your account."
              : "Enter your email and pass to login into your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="auth-form"
            onSubmit={(e: FormEvent<HTMLFormElement>) =>
              handleAuth(e, email, password, fullName)
            }
            noValidate
            className="touch-manipulation"
          >
            <div className="flex flex-col gap-6">
              {/* signup */}
              {isSignUp && (
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter Your Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            form="auth-form"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={() => navigate(isSignUp ? "/signin" : "/signup")}
            className="w-full cursor-pointer"
          >
            {isSignUp ? "Log In" : "Create an account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
