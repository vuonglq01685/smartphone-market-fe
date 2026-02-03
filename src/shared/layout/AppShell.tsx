import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell() {
    return (
        <div className="min-h-screen bg-ct-bg">
            <TopBar />
            <main className="pb-16">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
