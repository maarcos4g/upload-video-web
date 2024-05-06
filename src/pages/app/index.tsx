import { ChangeEvent, useEffect, useState } from "react";

import { IconButton } from "@/components/icon-button";
import { Table } from "@/components/table";
import { TableCell } from "@/components/table/table-cell";
import { TableHeader } from "@/components/table/table-header";
import { TableRow } from "@/components/table/table-row";
import { Status } from "@/components/status-widget";
import { SkeletonTable } from "@/components/skeleton-table";
import { DialogEdit } from "@/components/dialog-edit";

import { api } from "@/api";
import { env } from "@/env";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Storage } from "@/components/user-storage";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface File {
  id: string
  name: string
  slug: string
  size: string
  status: "VALID" | "PROCESSING" | "EXPIRED"
  createdAt: string
}

interface Storage {
  usage: {
    total: string
    percentage: string
  }
}

export function Home() {

  const [files, setFiles] = useState<File[]>([])
  const [storage, setStorage] = useState<Storage>()
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const totalPages = Math.ceil(total / 8)

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ""
    }

    return "";
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  useEffect(() => {
    const url = new URL(`${env.VITE_API_URL}/files`)

    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 1) {
      url.searchParams.set('query', search)
    }

    api.get(url.toString())
      .then(response => {
        setFiles(response.data.files)
        setTotal(response.data.total)
        setLoading(false)
      })

    api.get('/usage')
    .then(response => {
      setStorage(response.data)
    })
  }, [page, search])

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set("search", search);

    window.history.pushState({}, "", url);

    setSearch(search);
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set("page", String(page));

    window.history.pushState({}, "", url);

    setPage(page);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
  }

  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)

  function handleDeleteFile(fileId: string) {
    setDeletingFileId(fileId)
    api.delete(`/file/${fileId}`)
      .then(() => {
        toast.success("Arquivo deletado!");
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      })
      .catch(() => {
        toast.error("Ocorreu um erro ao deletar.");
      })
      .finally(() => setDeletingFileId(null))
  }

  function handleDownloadFile(fileId: string) {
    const downloadURL = new URL(`/${fileId}`, window.location.href)
    navigator.clipboard.writeText(downloadURL.toString())
    toast.info('URL copiada para a área de transferência.')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <h1 className="text-xl font-bold">Uploads</h1>
          <div className="px-3 w-72 py-1.5 border border-dashed border-zinc-700 rounded-full flex items-center gap-3">
            <Search className="size-4 text-zinc-500" />
            <input
              className="bg-transparent focus:ring-0 flex-1 outline-none border-0 p-0 text-sm"
              placeholder="Buscar uploads..."
              value={search}
              onChange={onSearchInputChanged}
            />
          </div>
        </div>

        {storage?.usage && <Storage usage={storage.usage} />}
      </div>

      {loading ? (<SkeletonTable />) :
        files.length === 0 ?
          <div className="flex flex-1 w-full h-full items-center justify-center">
            <h1 className="text-zinc-500 font-bold">Não existe nenhum arquivo para exibir</h1>
          </div> :
          (
            <Table>
              <thead>
                <tr className="border-b border-white/10">
                  <TableHeader>Vídeo</TableHeader>
                  {/* <TableHeader>Duração</TableHeader> */}
                  <TableHeader>Tamanho</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Enviado há</TableHeader>
                  <TableHeader style={{ width: 64 }}>Ações</TableHeader>
                </tr>
              </thead>

              <tbody>
                {files.map((file) => {
                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm text-zinc-300">
                            {file.name}
                          </span>
                          <span>{file.slug}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell>12:37</TableCell> */}
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        <Status status={file.status} />
                      </TableCell>
                      <TableCell>{dayjs().to(file.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 text-zinc">
                          <DialogEdit fileId={file.id} />

                          <IconButton
                            transparent
                            className="bg-black/70 border border-white/10 rounded-md p-1.5"
                            onClick={() => handleDownloadFile(file.id)}
                          >
                            <Download className="size-4 text-zinc-300" />
                          </IconButton>

                          <IconButton
                            transparent
                            className="bg-black/70 border border-white/10 rounded-md p-1.5"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            {deletingFileId === file.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-rose-500 dark:text-rose-400" />}
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>

              <tfoot>
                <tr>
                  <TableCell className="text-zinc-500" colSpan={3}>
                    Exibindo {files.length} de {total} itens
                  </TableCell>
                  <TableCell className="text-right" colSpan={3}>
                    <div className="inline-flex items-center gap-8">
                      <span className="text-zinc-500">
                        Página {page} de {totalPages}
                      </span>

                      <div className="flex gap-1.5">
                        <IconButton
                          onClick={goToFirstPage}
                          disabled={page === 1}
                        >
                          <ChevronsLeft className="size-4" />
                        </IconButton>
                        <IconButton
                          onClick={goToPreviousPage}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="size-4" />
                        </IconButton>
                        <IconButton
                          onClick={goToNextPage}
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="size-4" />
                        </IconButton>
                        <IconButton
                          onClick={goToLastPage}
                          disabled={page === totalPages}
                        >
                          <ChevronsRight className="size-4" />
                        </IconButton>
                      </div>
                    </div>
                  </TableCell>
                </tr>
              </tfoot>
            </Table>
          )}
    </div>
  )
}