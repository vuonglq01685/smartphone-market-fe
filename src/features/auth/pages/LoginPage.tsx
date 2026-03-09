import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { getErrorMessage } from "@/shared/utils/errorUtils";
import { toast } from "react-toastify";

export default function LoginPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [params] = useSearchParams();
    const returnTo = params.get("returnTo") ?? "/";

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!phone.trim()) {
            setErr("Vui lòng nhập SĐT.");
            toast.error("Vui lòng nhập SĐT.");
            return;
        }
        if (!/^\d{6}$/.test(password)) {
            setErr("Mật khẩu phải đúng 6 chữ số.");
            toast.error("Mật khẩu phải đúng 6 chữ số.");
            return;
        }

        try {
            setLoading(true);
            await login({ phone: phone.trim(), password });
            toast.success("Đăng nhập thành công!");
            nav(returnTo, { replace: true });
        } catch (ex: unknown) {
            const msg = getErrorMessage(ex, "Đăng nhập thất bại.");
            setErr(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-full py-16">
            <div className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl p-8 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Đăng nhập</h1>
                <form className="space-y-5" onSubmit={onSubmit}>
                    <label className="block">
                        <span className="mb-1 text-sm font-medium text-gray-700">Số điện thoại</span>
                        <input
                            className="w-full rounded-xl border px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            inputMode="tel"
                            placeholder="VD: 0901234567"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 text-sm font-medium text-gray-700">Mật khẩu (6 số)</span>
                        <input
                            className="w-full rounded-xl border px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            inputMode="numeric"
                            placeholder="123456"
                            type="password"
                        />
                    </label>

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 text-white py-2 font-semibold shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
                        type="submit"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-6 text-sm text-center text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                        className="text-indigo-700 underline font-medium hover:text-indigo-900 transition"
                        to={`/register?returnTo=${encodeURIComponent(returnTo)}`}
                    >
                        Tạo tài khoản
                    </Link>
                </div>
            </div>
        </div>
    );
}