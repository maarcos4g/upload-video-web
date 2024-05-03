import { FilePlus, ListVideo } from "lucide-react";
import { NavLink } from "./nav-link";
import { Separator } from "./ui/separator";
import { Logo } from "./logo";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b bg-[#121214] border-gray-500">
      <div className="flex h-16 items-center gap-6 px-6">
        <Logo />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <ListVideo className="h-4 w-4" />
            Uploads
          </NavLink>
          <NavLink to="/new">
            <FilePlus className="h-4 w-4" />
            Novo upload
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}