import { useEffect } from "react"
import { useParams } from "react-router-dom"

import { Loader2 } from "lucide-react"
import { env } from "@/env"

export function FileView() {

  const { id: fileId } = useParams()

  useEffect(() => {
    new Promise(resolve => setTimeout(resolve, 2000))
      .then(() => {
        const redirectURL = new URL(`/uploads/${fileId}`, env.VITE_API_URL)
        window.location.replace(redirectURL)
      })
  }, [])

  return (
    <div className="flex flex-col w-full h-screen gap-4 items-center justify-center">
      <Loader2 className="size-4 animate-spin" />
      <h1 className="text-base font-semibold">Buscando o arquivo...</h1>
    </div>
  )
}