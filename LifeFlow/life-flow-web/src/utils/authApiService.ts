import axios from "axios";

const baseURL = "https://donationservice.azurewebsites.net/api/";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

async function login(email: string, password: string, staySigned: boolean) {
    const response = await api.post("/Auth/login", {
        email,
        password,
        staySigned,
    });
    return response.data;
}

const register = async (userData: {
    email: string;
    name: string;
    phoneNumber: string;
    password: string;
    role: "Donor" | "HospitalAdmin" | "CenterAdmin" | "PharmaAdmin";
}) => {
    try {
        const response = await api.post("/Auth/register", userData);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
                error.response.data?.message || "An error occurred during registration";
            const errorStatus = error.response.data?.status || error.response.status;
            throw new Error(`${errorMessage} (Status: ${errorStatus})`);
        }
        throw new Error("An unexpected error occurred");
    }
};

const verifyOtp = async (email: string, otp: string) => {
    try {
        const response = await api.post("/Auth/verify-otp", { email, otp });
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
                error.response.data?.message || "An error occurred during registration";
            const errorStatus = error.response.data?.status || error.response.status;
            throw new Error(`${errorMessage} (Status: ${errorStatus})`);
        }
        throw new Error("An unexpected error occurred");
    }
};
const getAccessToken = async (refreshToken: string) => {
    try {
        const response = await api.get("/Auth/access-token", {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        return response.data.accessToken;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage =
                error.response.data?.message || "Failed to refresh access token";
            const errorStatus = error.response.data?.status || error.response.status;
            throw new Error(`${errorMessage} (Status: ${errorStatus})`);
        }
        throw new Error("An unexpected error occurred while refreshing the access token");
    }
};

export { login, register, verifyOtp, getAccessToken };