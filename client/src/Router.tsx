import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/Home";
import Puzzle from "./components/pages/Puzzle";
import ErrorPage from "./components/pages/ErrorPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element: <Home />},
        {path: "/puzzles/:name", element: <Puzzle />}
      ],
      errorElement: <ErrorPage />
    }
  ]);


  return <RouterProvider router={router} />;
};

export default Router;