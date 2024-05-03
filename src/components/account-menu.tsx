import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogOut, User2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

import { api } from "@/api";

interface AuthenticatedUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export function AccountMenu() {
  const [profile, setProfile] = useState<AuthenticatedUser>()
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useLayoutEffect(() => {
    api.get('/profile')
      .then((response) => {
        const user = response.data.user
        setProfile(user)
        setLoading(false)
      })
  }, [])

  function handleSignOut() {
    api.post('/sign-out')
      .then(() => {
        navigate('/sign-in', {
          replace: true
        })
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {loading ? (
          <div className="flex gap-3 items-center">
            <div className="flex flex-col gap-1.5 items-end">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ) : (
          <div
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex flex-col items-end">
              <span className="font-semibold text-zinc-50">{profile?.name}</span>
              <span className="font-normal text-zinc-400 text-xs">{profile?.email}</span>

            </div>
            {profile?.avatarUrl !== null ? (
              <img
                src={profile?.avatarUrl}
                alt="Avatar do usuário"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="p-2 bg-zinc-800 rounded-full flex items-center justify-center">
                <User2 className="w-6 h-6" />
              </div>
            )}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          {profile?.name}
          <span className="text-xs font-normal text-muted-foreground">
            {profile?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <User2 className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            asChild
            className="text-rose-500 dark:text-rose-400"
          >
            <button className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}