import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/layout/AppShell";
import { FeedPage } from "../features/posts/pages/FeedPage";
import { PostDetailPage } from "../features/posts/pages/PostDetailPage";
import { CreatePostWizardPage } from "../features/posts/pages/CreatePostWizardPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <FeedPage /> },
            { path: "posts/:id", element: <PostDetailPage /> },
            { path: "post/new", element: <CreatePostWizardPage /> },
        ],
    },
]);
