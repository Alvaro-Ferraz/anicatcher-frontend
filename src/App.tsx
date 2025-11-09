import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { AnimeSearchPage } from "./pages/AnimeSearchPage";
import { CharacterListPage } from "./pages/Character/CharacterListPage";
import { CharacterDetailsPage } from "./pages/Character/CharacterDetailsPage";
import { StaffListPage } from "./pages/Staff/StaffListPage";
import { StaffDetailsPage } from "./pages/Staff/StaffDetailsPage";
import { Overview } from "./pages/AnimeDetails/index.tsx";
import AnimeDetailLayout from "./components/layout/AnimeDetailLayout/index.tsx";

export const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/anime/search",
            element: <AnimeSearchPage />,
        },
        {
            path: "/anime/:id",
            element: <AnimeDetailLayout />, 
            children: [
                { index: true, element: <Overview /> },
                { path: "characters", element: <CharacterListPage /> },
                { path: "staff", element: <StaffListPage /> },
            ],
        },
        {
            path: "/character/:id",
            element: <CharacterDetailsPage />,
        },
        {
            path: "/staff/:id/:name",
            element: <StaffDetailsPage />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
