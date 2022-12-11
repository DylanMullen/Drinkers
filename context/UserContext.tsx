import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { getUser, logout as logoutUser, User } from "utils/UserUtil";

type Context = {
    user?: User;
    updateGuest: (name: string) => void
    logout: () => void
}

const initial: Context = {
    logout: () => { },
    updateGuest: () => { }
}

const UserContext = React.createContext<Context>(initial)


export default function useUser()
{
    return useContext(UserContext)
}

export function UserProvider({ children }: PropsWithChildren)
{
    const [user, setUser] = useState<Context>(initial)

    useEffect(() =>
    {
        let user = getUser();

        if (user.uuid === "") return;

        setUser(prev => { return { ...prev, user: user } })
    }, [])

    const logout = () =>
    {
        let user = logoutUser()
        setUser(prev => { return { ...prev, user: user } })
    }

    const updateGuestName = (name: string) =>
    {
        setUser(prev =>
        {
            if (prev.user === undefined) return prev;

            return {
                ...prev,
                user: {
                    ...prev.user,
                    username: name,
                }
            }
        })
    }

    return (
        <UserContext.Provider value={{
            user: user.user,
            logout: logout,
            updateGuest: updateGuestName
        }}>
            {children}
        </UserContext.Provider>
    )
}

