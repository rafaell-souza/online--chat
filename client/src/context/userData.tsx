import { createContext, useState } from "react";

export const userData = createContext({
    user: {
        id: "",
        name: "",
    },
    setUser: (user: { id: string, name: string }) => { }
})

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState({
        id: "",
        name:"",
    })
    return (
        <userData.Provider value={{ user, setUser }}>
            {children}
        </userData.Provider>
    )
}