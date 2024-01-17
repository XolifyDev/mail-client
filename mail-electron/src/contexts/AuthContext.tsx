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

    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    )
}