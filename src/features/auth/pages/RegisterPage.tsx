import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { getErrorMessage } from "@/shared/utils/errorUtils";
import type { RegisterPayload } from "@/shared/types/auth.types";

export default function RegisterPage() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [params] = useSearchParams();
    const returnTo = params.get("returnTo") ?? "/";

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<RegisterPayload["role"]>("Personal");

    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!name.trim()) return setErr("Vui lòng nhập tên.");
        if (!phone.trim()) return setErr("Vui lòng nhập SĐT.");
        if (!/^\d{6}$/.test(password)) return setErr("Mật khẩu phải đúng 6 chữ số.");

        try {
            setLoading(true);
            await register({ name: name.trim(), phone: phone.trim(), password, role });
            nav(returnTo, { replace: true });
        } catch (ex: unknown) {
            // BE có thể trả 400 ProblemDetails; trường hợp phone exists có thể là 500 theo swagger
            setErr(getErrorMessage(ex, "Tạo tài khoản thất bại (SĐT có thể đã tồn tại)."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md p-4">
            <h1 className="text-xl font-semibold">Tạo tài khoản</h1>

            {err && <div className="mt-3 rounded-xl border p-3 text-sm">{err}</div>}

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <label className="block">
                    <div className="mb-1 text-sm">Tên</div>
                    <input
                        className="w-full rounded-xl border px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="VD: Nguyen Van A"
                    />
                </label>

                <label className="block">
                    <div className="mb-1 text-sm">Số điện thoại</div>
                    <input
                        className="w-full rounded-xl border px-3 py-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        placeholder="VD: 0901234567"
                    />
                </label>

                <label className="block">
                    <div className="mb-1 text-sm">Mật khẩu (6 số)</div>
                    <input
                        className="w-full rounded-xl border px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputMode="numeric"
                        placeholder="123456"
                    />
                </label>

                <div className="rounded-xl border p-3">
                    <div className="mb-2 text-sm font-medium">Bạn là</div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`flex-1 rounded-xl border px-3 py-2 ${role === "Personal" ? "ring-2" : ""}`}
                            onClick={() => setRole("Personal")}
                        >
                            Người mua / cá nhân
                        </button>
                        <button
                            type="button"
                            className={`flex-1 rounded-xl border px-3 py-2 ${role === "Shop" ? "ring-2" : ""}`}
                            onClick={() => setRole("Shop")}
                        >
                            Cửa hàng (Shop)
                        </button>
                    </div>
                    <div className="mt-2 text-xs opacity-80">
                        * Chỉ tài khoản Shop mới đăng tin bán.
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full rounded-xl border px-3 py-2 font-medium disabled:opacity-60"
                    type="submit"
                >
                    {loading ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
            </form>

            <div className="mt-4 text-sm">
                Đã có tài khoản? <Link className="underline" to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Đăng nhập</Link>
            </div>
        </div>
    );
}
