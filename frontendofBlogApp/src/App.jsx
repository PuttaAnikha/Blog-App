
import { createBrowserRouter,RouterProvider } from 'react-router'
import RootComponent from "./components/RootComponent"
import HomeComponent from "./components/HomeComponent"
import RegisterComponent from "./components/RegisterComponent"
import Login from "./components/Login"
import UserProfile from "./components/UserProfile"
import AuthorProfile from "./components/AuthorProfile"
import AdminProfile from "./components/AdminProfile"
import AuthorArticle from "./components/AuthorArticle";
import Editarticle from './components/Editarticle'
import WriteArticle from "./components/WriteArticle";
import ArticleByID from "./components/ArticleById";
import { Toaster } from 'react-hot-toast';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const routerObj=createBrowserRouter(
        [{
        path:"/",
        element:<RootComponent/>,
children:[
    {
        path:"",
        element:<HomeComponent/>
    },
    {
        path:"register",
        element:<RegisterComponent/>
    },
    {
        path:"login",
        element:<Login/>
    },
    {
        path:"user-profile",
        element:(
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProfile/>
          </ProtectedRoute>
        ),
    },
    {
        path:"author-profile",
        element:(
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorProfile/>
          </ProtectedRoute>
          ),
        
        children: [
            {
              index: true,
              element: <AuthorArticle />,
            },
            {
              path: "articles",
              element: <AuthorArticle />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article",
          element: <Editarticle />,
        },
        {
          path:"unauthorized",
          element:<Unauthorized/>,
        },
    
        {
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
        },

]
}])
  return (
   <div>
    <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={routerObj}/>
        </div>
   
  )
}

export default App