interface StatusWidgetProps {
  status: "VALID" | "PROCESSING" | "EXPIRED"
}

export function Status(props: StatusWidgetProps) {
  return (
    <div>
      {
        props.status === 'VALID' ? (
          <div className="bg-teal-950 w-[54px] flex items-center justify-center rounded-xl text-teal-400 text-[10px] font-bold">
            VÁLIDO
          </div>
        ) : props.status === 'PROCESSING' ? (
          <div className="bg-yellow-950 w-[93px] flex items-center justify-center rounded-xl text-yellow-400 text-[10px] font-bold">
            PROCESSANDO
          </div>
        ) : (
          <div className="bg-red-950 w-[67px] flex items-center justify-center rounded-xl text-red-400 text-[10px] font-bold">
            EXPIRADO
          </div>
        )
      }
    </div>
  )
}