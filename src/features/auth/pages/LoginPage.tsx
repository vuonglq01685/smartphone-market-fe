import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { getErrorMessage } from "@/shared/utils/errorUtils";

export default function LoginPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [params] = useSearchParams();
    const returnTo = params.get("returnTo") ?? "/";

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!phone.trim()) return setErr("Vui lòng nhập SĐT.");
        if (!/^\d{6}$/.test(password)) return setErr("Mật khẩu phải đúng 6 chữ số.");

        try {
            setLoading(true);
            await login({ phone: phone.trim(), password });
            nav(returnTo, { replace: true });
        } catch (ex: unknown) {
            setErr(getErrorMessage(ex, "Đăng nhập thất bại."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md p-4">
            <h1 className="text-xl font-semibold">Đăng nhập</h1>

            {err && <div className="mt-3 rounded-xl border p-3 text-sm">{err}</div>}

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
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

                <button
                    disabled={loading}
                    className="w-full rounded-xl border px-3 py-2 font-medium disabled:opacity-60"
                    type="submit"
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <div className="mt-4 text-sm">
                Chưa có tài khoản? <Link className="underline" to={`/register?returnTo=${encodeURIComponent(returnTo)}`}>Tạo tài khoản</Link>
            </div>
        </div>
    );
}
