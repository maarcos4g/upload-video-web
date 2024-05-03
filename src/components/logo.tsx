import { PlaySquare } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3 text-lg font-medium">
      <PlaySquare className="h-5 w-5" />
      <span className="font-semibold">upload.video</span>
    </div>
  )
}