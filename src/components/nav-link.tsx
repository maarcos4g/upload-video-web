import { ComponentProps } from 'react'
import { Link, useLocation } from 'react-router-dom'

export type NavLinkProps = ComponentProps<typeof Link>

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation()

  return (
    <Link
      className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors px-3 py-1.5 rounded-full data-[current=true]:bg-zinc-800 data-[current=true]:text-zinc-100"
      data-current={pathname === props.to}
      {...props}
    >
      {props.children}
    </Link>
  )
}