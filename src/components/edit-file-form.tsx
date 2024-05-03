import { useEffect, useLayoutEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditFileFormProps {
  fileId: string
}

interface File {
  id: string
  name: string
  slug: string
}

const editFileSchema = z.object({
  name: z.string().min(3, { message: 'Digite pelo menos 3 caracteres.' }),
  slug: z.string().regex(/^[a-zA-Z0-9\s-]+$/, { message: "O slug deve conter apenas letras e hifens." }),
})

type EditFileSchema = z.infer<typeof editFileSchema>

export function EditFileForm({ fileId }: EditFileFormProps) {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<EditFileSchema>({
    resolver: zodResolver(editFileSchema),
  })

  async function handleEditFile({ name, slug }: EditFileSchema) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    api.put(`/update/${fileId}`, {
      name,
      slug,
    })
    .then(async () => {
      toast.success('Arquivo editado com sucesso!')
      await new Promise(resolve => setTimeout(resolve, 1000))
      window.location.reload()
    })
    .catch(() => toast.error('Ocorreu um erro!'))
  }

  useLayoutEffect(() => {
    api.get(`/file/${fileId}`)
      .then(async (response) => {
        const file = response.data
        setFile(file)
        setLoading(false)
      })
  }, [fileId])

  useEffect(() => {
    if (file) {
      reset({ name: file.name, slug: file.slug })
    }
  }, [reset, file])

  return (
    <div>
      {loading ? (
        <div className="flex flex-1 h-20 items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleEditFile)} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block" htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              {...register('name')}
              className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
            />
            {errors?.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block" htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              {...register('slug')}
              className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
            />
            {errors?.slug && (
              <p className="text-sm text-red-400">{errors.slug.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost">
                Cancelar
              </Button>
            </Dialog.Close>
            <Button className="gap-1.5">
              {isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-4" />}
              Salvar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}