import { api } from "@/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { twMerge } from "tailwind-merge";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') ?? ''
    }
  })

  async function handleAuthenticate({ email }: SignInSchema) {
    try {
      await api.post('/authenticate', { email })
      
      toast.success('Enviamos um link de autenticação para o seu e-mail.')
    } catch (error) {
      toast.error('Credenciais inválidas!')
    }
  }

  return (
    <div className="lg:p-8 text-zinc-50">
      <a
        href="/sign-up"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        Criar Conta
      </a>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar plataforma
          </h1>
          <p className="text-sm text-gray-500">
            Entre e aproveite as vantagens do <strong>upload.video</strong>
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(handleAuthenticate)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Seu e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...register('email')}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}