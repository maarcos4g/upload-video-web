interface StorageProps {
  usage: {
    total: string
    percentage: string
  }
}

export function Storage(props: StorageProps) {

  const percentage = Number(props.usage.percentage)

  return (
    <div className="w-[296px] flex flex-col gap-2 relative">
      <div className="flex items-center justify-between">
        <span className="text-zinc-300 font-medium">Armazenamento</span>
        <span className="text-xs text-zinc-500">
          <label className="font-medium text-zinc-300">{props.usage.total}GB</label>/10GB
        </span>
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-zinc-700 rounded-full relative"></div>
        <div className="h-2 bg-rose-400 rounded-full absolute top-0" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}