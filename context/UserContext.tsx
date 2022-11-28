import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import {  getUser, User } from "utils/UserUtil";


const UserContext = React.createContext<User | undefined>(undefined)


export default function useUser()
{
    return useContext(UserContext)
}

export function UserProvider({ children }: PropsWithChildren)
{
    const [user, setUser] = useState<User | undefined>()
    useEffect(() =>
    {
        let user = getUser();

        if (user.uuid === "") return;

        setUser(user)
    }, [])

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

