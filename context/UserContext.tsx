import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { getUser, logout as logoutUser, saveUser, User } from "utils/UserUtil";

type Context = {
    user?: User;
    updateGuest: (name: string) => void,
    updateGuestAvatar: (avatar: string) => void
    logout: () => void
}

const initial: Context = {
    logout: () => { },
    updateGuest: () => { },
    updateGuestAvatar: () => { }
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

            prev.user.username = name
            saveUser(prev.user)

            return {
                ...prev,
            }
        })
    }

    const updateGuestAvatar = (avatar: string) =>
    {

        setUser(prev =>
        {
            if (prev.user === undefined) return prev;

            prev.user.avatar = avatar
            saveUser(prev.user)
            return {
                ...prev,
            }
        })
    }

    return (
        <UserContext.Provider value={{
            user: user.user,
            logout: logout,
            updateGuest: updateGuestName,
            updateGuestAvatar: updateGuestAvatar
        }}>
            {children}
        </UserContext.Provider>
    )
}

