import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/Home";
import Game from "./components/pages/Game";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {index: true, element: <Home />},
        {path: "/game/:name", element: <Game />}
      ]
    }
  ]);


  return <RouterProvider router={router} />;
};

export default Router;