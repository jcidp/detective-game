import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/Home";
import Puzzle from "./components/pages/Puzzle";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element: <Home />},
        {path: "/puzzle/:name", element: <Puzzle />}
      ]
    }
  ]);


  return <RouterProvider router={router} />;
};

export default Router;