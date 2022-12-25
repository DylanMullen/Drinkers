
import { GradientPosition } from 'components/shared/input/gradient/slider/GradientSlider'
import React, { useContext, useState } from 'react'

type Props = React.PropsWithChildren & {
    grads: { [id: string]: GradientPosition }
}

type ContextProps = {
    gradients: { [id: string]: GradientPosition },
    getGradient: (uuid: string) => GradientPosition,
    addGradient: (grad: GradientPosition) => void,
    removeGradient: (uuid: string) => void,
    updateGradient: (grad: GradientPosition) => void
}

const INIT:ContextProps = {
    gradients: {},
    addGradient: ()=>{},
    getGradient:(uuid:string)=>INIT.gradients[uuid],
    removeGradient: ()=>{},
    updateGradient:()=>{}
}

const Context = React.createContext<ContextProps>(INIT)

export default function useGradientContext(){
    return useContext(Context);
}

export function GradientContextProvider({ children, grads }: Props)
{
    const [gradients, setGradient] = useState(grads);

    const getGradient = (uuid: string) => gradients[uuid]
    const addGradient = (grad: GradientPosition) => setGradient({ ...gradients, [grad.uuid]: grad })
    const removeGradient = (uuid: string) =>
    {
        setGradient(prev =>
        {
            let temp = prev;
            delete prev[uuid]
            return temp
        })
    }

    const updateGradient = (grad: GradientPosition) => setGradient({ ...gradients, [grad.uuid]: grad })

    return (
        <Context.Provider value={{gradients, addGradient, getGradient, removeGradient, updateGradient}}>
            {children}
        </Context.Provider>
    )
}

