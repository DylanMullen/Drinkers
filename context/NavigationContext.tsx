import { useRouter } from 'next/router'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

type Props = {}

interface Navigation
{
    isShown: boolean
    showNavigationButton: () => void
    hideNavigationButton: () => void
}


const NavigationContext = React.createContext<Navigation>({
    isShown: true,
    hideNavigationButton: () => { },
    showNavigationButton: () => { }
})

function useNavigation()
{
    return useContext(NavigationContext);
}


export function NavigationContextProvider({ children }: PropsWithChildren)
{
    const [shown, setShown] = useState(true);
    const router = useRouter()

    const show = () => setShown(true);
    const hide = () => setShown(false);

    return (
        <NavigationContext.Provider value={{ isShown: shown, showNavigationButton: show, hideNavigationButton: hide }}>
            {children}
        </NavigationContext.Provider>
    )
}

export default useNavigation