import { Logo } from '@/components/logo'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center antialiased md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col border-r border-zinc-500 bg-zinc-900 p-10 dark:border-r lg:flex">
        <Logo />
        <div className="mt-auto">
          <footer className="text-sm text-zinc-500">
            Upload de vídeos &copy; <strong>upload.video</strong> - {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="relative bg-zinc-950 flex min-h-screen flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}