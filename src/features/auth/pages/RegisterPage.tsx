import { useAuth } from "@/shared/hooks/useAuth";
import type { RegisterPayload } from "@/shared/types/auth.types";
import { getErrorMessage } from "@/shared/utils/errorUtils";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [params] = useSearchParams();
    const returnTo = params.get("returnTo") ?? "/";

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<RegisterPayload["role"]>("Personal");

    const [, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!name.trim()) {
            setErr("Vui lòng nhập tên.");
            toast.error("Vui lòng nhập tên.");
            return;
        }
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
            await register({ name: name.trim(), phone: phone.trim(), password, role });
            toast.success("Tạo tài khoản thành công!");
            nav(returnTo, { replace: true });
        } catch (ex: unknown) {
            const msg = getErrorMessage(ex, "Tạo tài khoản thất bại (SĐT có thể đã tồn tại).");
            setErr(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center h-full py-8">
                <div className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl p-8 backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Tạo tài khoản</h1>
                    <form className="space-y-5" onSubmit={onSubmit}>
                        <label className="block">
                            <span className="mb-1 text-sm font-medium text-gray-700">Tên</span>
                            <input
                                className="w-full rounded-xl border px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="VD: Nguyen Van A"
                            />
                        </label>

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

                        <div className="rounded-xl border p-3 bg-gray-50">
                            <div className="mb-2 text-sm font-medium">Bạn là</div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className={`flex-1 rounded-xl border px-3 py-2 font-semibold transition ${role === "Personal"
                                        ? "ring-2 ring-indigo-400 bg-indigo-50 border-indigo-300 text-indigo-700"
                                        : "bg-white border-gray-200"
                                        }`}
                                    onClick={() => setRole("Personal")}
                                >
                                    Người mua / cá nhân
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 rounded-xl border px-3 py-2 font-semibold transition ${role === "Shop"
                                        ? "ring-2 ring-indigo-400 bg-indigo-50 border-indigo-300 text-indigo-700"
                                        : "bg-white border-gray-200"
                                        }`}
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
                            className="w-full rounded-xl bg-indigo-600 text-white py-2 font-semibold shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
                            type="submit"
                        >
                            {loading ? "Đang tạo..." : "Tạo tài khoản"}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-center text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link
                            className="text-indigo-700 underline font-medium hover:text-indigo-900 transition"
                            to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}