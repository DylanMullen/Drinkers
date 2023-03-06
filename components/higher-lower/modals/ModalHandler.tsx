import { useModalContext } from 'context/ModalContext';
import React, { useEffect } from 'react'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import NextTurn from './next-turn';

type Props = {}

function ModalHandler({ }: Props)
{
    const nextPlayer = useAppSelector(HiLoSelectors.nextUser);
    const { open, update, close } = useModalContext();

    useEffect(() =>
    {
        let user = HiLoSelectors.getUser(nextPlayer)
        if (!user) return;

        close()
        update(<NextTurn username={user.username} callbacks={{end:()=>close()}}/>, false)
        open()
    }, [nextPlayer])

    return (
        <>
        </>
    )
}

export default ModalHandler