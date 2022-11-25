import { current } from '@reduxjs/toolkit';
import TextInput from 'components/shared/input/text';
import React, { Suspense, useState } from 'react'
import Pack, { PackPrompt } from 'services/pirate/models/Pack'

import { v4 as uuid } from 'uuid';

import styles from 'styles/pages/pirate/creator.module.scss'


type Props = {}

function PirateCreator({ }: Props)
{
    const [pack, setPack] = useState<Pack>();


    let packCreated = pack !== undefined

    return (
        <>
        



        </>
    )
}



export default PirateCreator