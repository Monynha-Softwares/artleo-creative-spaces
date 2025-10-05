import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContactMessages } from "@/hooks/useContactMessages";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const {
    data: contactMessages = [],
    isLoading: loadingMessages,
    error: contactMessagesError,
  } = useContactMessages({ enabled: isAdmin });

  const recentMessages = useMemo(() => contactMessages.slice(0, 5), [contactMessages]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    
    if (!error) {
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);
    
    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 px-4 pt-24 pb-16">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="w-full max-w-3xl border-border/60 bg-surface-0/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent contact messages</CardTitle>
            <CardDescription>These submissions are visible only to administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingMessages ? (
              <p className="text-sm text-muted-foreground">Loading messages…</p>
            ) : contactMessagesError ? (
              <p className="text-sm text-destructive">
                Unable to load contact messages right now.
              </p>
            ) : recentMessages.length > 0 ? (
              <ul className="space-y-4">
                {recentMessages.map((message) => (
                  <li
                    key={message.id}
                    className="rounded-2xl border border-border/60 bg-surface-1/80 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div>
                        <p className="font-semibold text-foreground">{message.name}</p>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-muted-foreground underline-offset-2 hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      {message.status && (
                        <Badge variant="secondary" className="capitalize">
                          {message.status}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {message.message}
                    </p>
                    {message.created_at && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Received {new Date(message.created_at).toLocaleString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No contact messages yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Auth;
