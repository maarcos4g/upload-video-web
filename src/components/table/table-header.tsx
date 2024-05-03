import { ComponentProps } from "react";

interface TableHeaderProps extends ComponentProps<"th"> {}

export function TableHeader(props: TableHeaderProps) {
  return (
    <th className="py-3 px-4 text-sm font-semibold text-left text-zinc-300" {...props} />
  );
}