import { axios } from "@/lib/axios";
import { loginUser } from "@/lib/axios/auth";
import { createContext, useEffect, useState } from "react";

export const MailContext = createContext<any>(null);

export const MailContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mails, setMails] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    

    return (
        <MailContext.Provider value={{  }}>
            {children}
        </MailContext.Provider>
    )
}