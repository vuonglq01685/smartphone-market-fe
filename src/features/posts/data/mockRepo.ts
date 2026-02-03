import { mockPosts } from "../pages/ui/mockPosts";

export function getMockPostById(id: string) {
    return mockPosts.find((x) => x.id === id);
}
