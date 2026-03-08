import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // chỉnh path nếu khác

export function BottomNav() {
    const { pathname } = useLocation();
    const { isAuthed, isShop } = useAuth();

    // Rule:
    // - not authed: show "Đăng tin" nhưng bấm -> /login?returnTo=/post/new
    // - authed + shop: show "Đăng tin" -> /post/new
    // - authed + not shop: hide "Đăng tin"
    const showPost = !isAuthed || isShop;
    const postTo = !isAuthed
        ? `/login?returnTo=${encodeURIComponent("/post/new")}`
        : "/post/new";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ct-line">
            <div className="mx-auto max-w-[720px] px-2">
                <div
                    className={[
                        "grid py-2 text-center text-[11px] text-ct-sub",
                        showPost ? "grid-cols-4" : "grid-cols-3",
                    ].join(" ")}
                >
                    <NavItem to="/" label="Trang chủ" active={pathname === "/"} />
                    <NavItem to="/saved" label="Tin đã lưu" active={pathname.startsWith("/saved")} />

                    {showPost && (
                        <NavItem
                            to={postTo}
                            label="Đăng tin"
                            emphasize
                            active={pathname.startsWith("/post/new")}
                        />
                    )}

                    <NavItem to="/me" label="Tài khoản" active={pathname.startsWith("/me")} />
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
