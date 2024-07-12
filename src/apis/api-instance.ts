import axios from "axios";
import {Cookies} from "react-cookie";
import {ReIssueRequestDto} from "./request/auth";
import {ReIssueResponseDto} from "./response/auth";

const cookies = new Cookies();

const BASE_URL = 'http://localhost:4000/api/v1';
const RE_ISSUE_URL = '/auth/re-issue';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = cookies.get('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = cookies.get('refreshToken');
                const accessToken = cookies.get('accessToken');

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const reIssueRequestDto: ReIssueRequestDto = {
                    accessToken,
                    refreshToken,
                };

                const response = await axios.post<ReIssueResponseDto>(
                    `${BASE_URL}${RE_ISSUE_URL}`,
                    reIssueRequestDto
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken , accessTokenExpiresIn} = response.data;

                cookies.set('accessToken', newAccessToken, { path: '/', maxAge: accessTokenExpiresIn / 1000 });
                cookies.set('refreshToken', newRefreshToken, { path: '/' });

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (reIssueError) {
                cookies.remove('accessToken', { path: '/' });
                cookies.remove('refreshToken', { path: '/' });
                return Promise.reject(reIssueError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
