import { useRouter } from 'next/router'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

type Props = {}

interface Navigation
{
    btnVisible: boolean,
    visible: boolean,
    showNavigationButton: () => void
    hideNavigationButton: () => void
    show: () => void
    hide: () => void
}

const initial: Navigation = {
    btnVisible: true,
    visible: false,
    showNavigationButton: () => { },
    hideNavigationButton: () => { },
    show: () => { },
    hide: () => { }
}


const NavigationContext = React.createContext<Navigation>(initial)

function useNavigation()
{
    return useContext(NavigationContext);
}


export function NavigationContextProvider({ children }: PropsWithChildren)
{
    const [ctx, setCtx] = useState<Navigation>(initial);

    const show = () => setCtx(prev => { return { ...prev, visible: true } })
    const hide = () => setCtx(prev => { return { ...prev, visible: false } })

    const showBtn = () => setCtx(prev => { return { ...prev, btnVisible: true } })
    const hideBtn = () => setCtx(prev => { return { ...prev, btnVisible: false } })

    console.log("test")

    return (
        <NavigationContext.Provider value={{
            btnVisible: ctx.btnVisible,
            visible: ctx.visible,
            show: show,
            hide: hide,
            showNavigationButton: showBtn,
            hideNavigationButton: hideBtn
        }}
        >
            {children}
        </NavigationContext.Provider>
    )
}

export default useNavigation