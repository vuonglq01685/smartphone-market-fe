import { env } from "@/config/env";
import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: env.API_BASE_URL,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("spm_token");
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status) {
            const { status } = error.response;

            // Xử lý trường hợp token không hợp lệ hoặc hết hạn
            if (status === 401) {
                // 1. Xóa token cũ, không hợp lệ khỏi localStorage
                localStorage.removeItem("spm_token");

                // 2. Thông báo cho người dùng một cách thân thiện
                toast.warn("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

                // 3. Tải lại trang. Vì token đã bị xóa, ứng dụng sẽ tự động
                // chuyển hướng đến trang login một cách "sạch sẽ".
                // Dùng một chút delay để người dùng kịp đọc thông báo.
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

                // Trả về một promise đã được giải quyết để ngăn các lỗi khác nối tiếp
                return Promise.resolve();
            }
        }
    }
);

// Hàm gọi API chung
export const apiCall = (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data: Record<string, unknown> = {},
    headers: Record<string, string> = {}
): Promise<any> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        headers,
    };

    if (method === "GET") {
        config.params = data;
    } else {
        config.data = data;
    }

    return instance(config).then((response) => response.data);
};