import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
    const { pathname } = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ct-line">
            <div className="mx-auto max-w-[720px] px-2">
                <div className="grid grid-cols-4 py-2 text-center text-[11px] text-ct-sub">
                    <NavItem to="/" label="Trang chủ" active={pathname === "/"} />
                    <NavItem to="/saved" label="Tin đã lưu" />
                    <NavItem to="/post/new" label="Đăng tin" emphasize active={pathname.startsWith("/post/new")} />
                    <NavItem to="/me" label="Tài khoản" />
                </div>
            </div>
        </div>
    );
}

function NavItem({
                     to,
                     label,
                     active,
                     emphasize,
                 }: {
    to: string;
    label: string;
    active?: boolean;
    emphasize?: boolean;
}) {
    return (
        <Link
            to={to}
            className={[
                "flex flex-col items-center justify-center gap-1",
                active ? "text-ct-text font-semibold" : "",
            ].join(" ")}
        >
            <div
                className={[
                    "h-6 w-6 rounded-full border border-ct-line bg-ct-chip",
                    emphasize ? "bg-ct-yellow border-transparent" : "",
                ].join(" ")}
            />
            <div className={emphasize ? "text-ct-text font-semibold" : ""}>
                {label}
            </div>
        </Link>
    );
}
