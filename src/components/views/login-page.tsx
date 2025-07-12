"use client";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, OctagonAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../theme/theme-toogle";
import Image from "next/image";
import { signInSchema } from "@/utils/zod/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function LoginPage({
  onSubmit,
  serverError,
  status,
}: {
  onSubmit: (values: SignInFormValues) => void;
  serverError?: string;
  status?: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServerError, setShowServerError] = useState(!!serverError);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    setShowServerError(true);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      if (showServerError) {
        setShowServerError(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, showServerError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10 px-4 py-12 overflow-hidden">
      <div className="relative w-full max-w-lg">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />

        {/* Login container */}
        <div className="relative z-10 bg-card border border-primary/20 rounded-3xl shadow-xl p-8">
          {/* Header with logo and theme toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image
                src="/images/logo.png"
                width={40}
                height={40}
                alt="Logo Municipalidad de Kimbiri"
                className="rounded-full object-contain border border-primary/30"
              />
              <span className="text-lg font-bold text-primary">Kimbiri SGD</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Welcome message */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Iniciar Sesión</h1>
            <p className="text-sm text-muted-foreground mt-1">Accede al sistema de Tramite documentario</p>
          </div>

          {/* Server error message */}
          {showServerError && serverError && (
            <Alert variant={status === 200 ? "default" : "destructive"} className="mb-6 rounded-lg">
              <AlertDescription className={`flex items-center gap-3 ${status === 200 ? "text-green-600" : "text-destructive"}`}>
                <OctagonAlert className="h-4 w-4" />
                <span>{serverError}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Username field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          placeholder="Usuario o DNI"
                          {...field}
                          className="pl-10 h-11 bg-input text-foreground rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-destructive" />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          {...field}
                          className="pl-10 pr-10 h-11 bg-input text-foreground rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-destructive" />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Accediendo..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>

          {/* Footer link */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Municipalidad de Kimbiri
        </div>
      </div>
    </div>
  );
}