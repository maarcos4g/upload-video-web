import * as Dialog from "@radix-ui/react-dialog";
import { SquarePen } from "lucide-react";
import { IconButton } from "./icon-button";
import { EditFileForm } from "./edit-file-form";

interface DialogEditProps {
  fileId: string
}

export function DialogEdit({ fileId }: DialogEditProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton
          transparent
          className="bg-black/70 border border-white/10 rounded-md p-1.5"
        >
          <SquarePen className="size-4 text-zinc-300" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[421px] z-10 bg-zinc-950 border-l border-zinc-900">
          <div className="space-y-3">
            <Dialog.Title className="text-xl font-bold">
              Editar arquivo
            </Dialog.Title>
          </div>

          <EditFileForm fileId={fileId} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}