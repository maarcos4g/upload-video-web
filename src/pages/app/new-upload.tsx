import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { removeContentType } from "@/utils/remove-text-content-type";
import axios from "axios";
import { FolderSearch, Upload } from "lucide-react";
import { useState, ChangeEvent, useMemo, FormEvent } from "react";
import { toast } from "sonner";

export function NewUpload() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  let nameWithoutContentType = videoFile?.name;

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return;
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile])

  async function handleUploadVideo(event: FormEvent) {
    event.preventDefault()

    if (!videoFile) {
      return null;
    }

    setVisible(true)

    if (videoFile.name.includes('.mp4')) {
       nameWithoutContentType = removeContentType(videoFile.name)
    }

    console.log(previewURL)

    await api.post('/uploads', {
      name: nameWithoutContentType,
      contentType: videoFile.type,
      size: videoFile.size,
    }, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(progress)
        }
      }
    }).then(async (response) => {
      const fileIdResponse = response.data.fileId
      const signedUrl = response.data.signedUrl

      await axios.put(signedUrl, videoFile, {
        headers: {
          'Content-Type': 'video/mp4'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(progress)
          }
        }
      })
        .then(async () => {
          toast.warning('Aguarde, estamos processando o arquivo...')
          await api.put(`/status/${fileIdResponse}`, {}, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgress(progress)
              }
            }
          }).then(() => {
            toast.success('Seu arquivo foi processado e já está disponível para download.')
            setVisible(false)
          })
        })

    }).catch(() => {
      toast.error('Ocorreu um erro ao enviar o vídeo.')
      setVisible(false)
      setVideoFile(null)
    })
  }

  return (
    <form onSubmit={handleUploadVideo} className="flex flex-1 flex-col gap-4 items-center justify-center">
      <label
        htmlFor="media"
        className="w-80 h-40 border border-dashed flex flex-col rounded-lg aspect-video cursor-pointer gap-4 items-center justify-center border-zinc-800"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none inset-0 w-full h-full"
          />
        ) : (
          <>
            <div className="border border-zinc-700 px-2 py-1 rounded-xl bg-zinc-800">
              <FolderSearch
                className="size-4 text-white"
              />
            </div>
            <span className="text-sm text-zinc-500">Selecione um vídeo</span>
          </>
        )}
      </label>

      <input
        onChange={onFileSelected}
        accept="video/mp4"
        type="file"
        name="media"
        id="media"
        className="invisible h-0 w-0"
      />

      {visible ? (
        <div className="relative w-80 h-10 rounded-md bg-teal-950" style={{ width: 320 }}>
          <Button className="absolute bg-[#062827]" style={{ width: `${progress}%` }}>
            {progress}%
          </Button>
        </div>
      ) : (
        <Button
          className="w-80 gap-4"
          disabled={previewURL ? false : true}
        >
          Carregar vídeo
          <Upload className="size-4" />
        </Button>
      )}
    </form>
  )
}