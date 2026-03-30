import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
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

const formSchema = z
  .object({
    email: z.string().email({ message: "Debe ser un email válido" }),
    token: z.string().min(1, { message: "El token es requerido" }),
    newPassword: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "La contraseña debe contener al menos una minúscula, una mayúscula y un número",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
}

export function ResetPasswordForm({
  className,
  onBack,
  ...props
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener email y token de la URL
  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailFromUrl,
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.resetPassword({
        email: values.email,
        token: values.token,
        newPassword: values.newPassword,
      });

      setSuccess(true);
      toast.success(response.message || "Contraseña actualizada exitosamente");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      let errorMessage = "Error al actualizar la contraseña";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "error" in err) {
        errorMessage = String((err as Record<string, unknown>).error);
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
          <h2 className="text-xl font-semibold text-green-600">
            ¡Contraseña actualizada!
          </h2>
          <p className="text-sm text-gray-600">
            Tu contraseña ha sido cambiada exitosamente.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo al inicio de sesión...
          </p>
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
        <h2 className="text-xl font-semibold">Nueva contraseña</h2>
      </div>

      <p className="text-sm text-gray-600">
        Ingresa el código que recibiste y tu nueva contraseña.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="token">Código de recuperación</FormLabel>
                  <FormControl>
                    <Input
                      id="token"
                      placeholder="Ingresa el código"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      disabled={isLoading}
                      aria-invalid={!!form.formState.errors.token}
                      className="bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">Nueva contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        placeholder="Nueva contraseña"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        disabled={isLoading}
                        aria-invalid={!!form.formState.errors.newPassword}
                        className="bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        placeholder="Confirma la contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        disabled={isLoading}
                        aria-invalid={!!form.formState.errors.confirmPassword}
                        className="bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
              Actualizar contraseña
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate("/forgot-password")}
          className="text-sm"
        >
          ¿No recibiste el código? Reenviar
        </Button>
      </div>
    </div>
  );
}
