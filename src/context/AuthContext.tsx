'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "../lib/firebase";


interface AuthContextProps {
    user: User | null;


}

const AuthContext = createContext<AuthContextProps>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [user]);

    return (<AuthContext.Provider value={{ user}}>{children}</AuthContext.Provider>);
};

export const useAuth = () => {
    return useContext(AuthContext)
}