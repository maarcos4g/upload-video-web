import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import { Toaster } from "sonner";

export function App() {
  return (
    <>
    <RouterProvider router={router} />
    <Toaster richColors />
    </>
  )
}