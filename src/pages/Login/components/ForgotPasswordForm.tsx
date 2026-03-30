import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authApi } from "@/APIs/auth.api";

const formSchema = z.object({
  email: z.string().email({ message: "Debe ser un email válido" }),
});

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
}

export function ForgotPasswordForm({
  className,
  onBack,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await authApi.forgotPassword(values.email);

      // En desarrollo, mostrar el token (como indica la API)
      if (response.data?.token) {
        console.log(
          "Token generado (cópialo para testing):",
          response.data.token,
        );
        toast.success("Token generado. Revisa la consola para copiarlo.", {
          duration: 10000,
        });
      }

      setSuccess(true);
      toast.success(response.message || "Se ha enviado un enlace a tu email");

      // Opcional: redirigir a página de reset con email
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      let errorMessage = "Error al solicitar recuperación";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as Record<string, unknown>).message);
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">¡Revisa tu email!</h2>
          <p className="text-sm text-gray-600">
            Te hemos enviado un enlace para recuperar tu contraseña.
          </p>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full"
          >
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex items-center gap-2">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-xl font-semibold">Recuperar contraseña</h2>
      </div>

      <p className="text-sm text-gray-600">
        Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="tu@email.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      aria-invalid={!!form.formState.errors.email}
                      className="bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              disabled={isLoading}
              className="button-animate bg-black text-white hover:bg-zinc-800 rounded-full w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar enlace de recuperación
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate("/login")}
          className="text-sm"
        >
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
}
