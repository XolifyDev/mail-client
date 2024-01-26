import { axios } from "@/lib/axios";
import { loginUser } from "@/lib/axios/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        imap_server: string,
        imap_port: string,
        smtp_server: string,
        smtp_port: string
    } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }

        getUserData();

    }, [localStorage, token]);

    const getUserData = async () => {
        console.log(token);
        const result = await axios.get("/auth", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(result);

        setUser(result.data.user);
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const result = await loginUser({ email, password });
        if (result.data.token) {
            localStorage.setItem("token", result.data.token);
            setToken(result.data.token);
            setUser(result.data.user);
            return result.data;
        }
        setIsLoading(false);
        return result.data;
    }


    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, isLoading, setIsLoading, login }}>
            {children}
        </AuthContext.Provider>
    )
}