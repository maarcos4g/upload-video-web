import { Skeleton } from "@/components/ui/skeleton"
import { Table } from "./table"
import { TableHeader } from "./table/table-header"
import { TableRow } from "./table/table-row"
import { TableCell } from "./table/table-cell"

export function SkeletonTable() {
  const filesSkeleton: string[] = Array.from({ length: 15 }, () => window.crypto.randomUUID())

  return (
    <Table>
      <thead>
        <tr className="border-b border-white/10">
          <TableHeader>Vídeo</TableHeader>
          <TableHeader>Tamanho</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Enviado há</TableHeader>
          <TableHeader style={{ width: 64 }}></TableHeader>
        </tr>
      </thead>

      <tbody>
        {filesSkeleton.map(skeleton => {
          return (
            <TableRow key={skeleton}>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}