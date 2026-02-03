import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/layout/AppShell";
import { FeedPage } from "../features/posts/pages/FeedPage";
import { PostDetailPage } from "../features/posts/pages/PostDetailPage";
import { CreatePostWizardPage } from "../features/posts/pages/CreatePostWizardPage";

// NEW: auth pages + guard
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import { RequireShop } from "../shared/components/auth/RequireShop";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <FeedPage /> },
            { path: "posts/:id", element: <PostDetailPage /> },

            // 🔒 shop-only create post
            {
                path: "post/new",
                element: (
                    <RequireShop>
                        <CreatePostWizardPage />
                    </RequireShop>
                ),
            },

            // auth
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
        ],
    },
]);
