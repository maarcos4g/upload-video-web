import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./pages/_layouts/app";
import { NotFound } from "./pages/404";
import { AuthLayout } from "./pages/_layouts/auth";

import { Home } from "./pages/app";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { NewUpload } from "./pages/app/new-upload";
import { FileView } from "./pages/app/file-view";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/new',
        element: <NewUpload />
      },
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />
      }
    ]
  },
  //Public route
  {
    path: '/',
    children: [
      {
        path: '/:id',
        element: <FileView />
      }
    ]
  }
])