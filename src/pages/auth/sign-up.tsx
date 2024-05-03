import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/api";

import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  async function handleRegisterUser({ email, name }: SignUpSchema) {
    try {
      await api.post('/user', {
        email,
        name,
      })

      toast.success('Cadastro concluído com sucesso!', {
        action: {
          label: "Login",
          onClick: () => {
            navigate(`/sign-in?email=${email}`)
          }
        }
      })
    } catch (error) {
      toast.error('Erro ao se cadastrar.', {
        //@ts-ignore
        description: error.response.data.message,
      })
    }
  }

  return (
    <div className="lg:p-8 text-zinc-50">
      <a
        href="/sign-in"
        className={twMerge(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        Fazer login
      </a>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-sm text-gray-500">
            Entre e aproveite as vantagens do <strong>upload.video</strong>
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(handleRegisterUser)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Seu nome</Label>
                <Input
                  id="name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  {...register('name')}
                />
              </div>

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
                Finalizar cadastro
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}