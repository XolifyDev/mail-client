import { State, create } from "zustand";
import { Email } from "@prisma/client"

interface EmailStore {
    emails: Email[];
    setEmails: (emails: Email[]) => void;
    addEmail: (email: Email) => void;
    deleteEmail: (email: Email) => void;
    updateEmail: (email: Email) => void;
}

const useEmailStore = create<EmailStore>((set) => ({
    addEmail: (email: Email) => {
        set((state) => ({
            ...state,
            emails: [
                ...state.emails,
                email
            ]
        }))
    },  
    deleteEmail: (email: Email) => {
        set((state) => ({
          ...state,
             emails: state.emails.filter((e) => e.id!== email.id)
        }))
    },
    updateEmail: (email: Email) => {
        set((state) => ({
          ...state,
             emails: state.emails.map((e) => e.id === email.id? email : e)
        }))
    },
    setEmails: (emails: Email[]) => {
        set((state) => ({
          ...state,
             emails
        }))
    },
    emails: [],
}));

export default useEmailStore;