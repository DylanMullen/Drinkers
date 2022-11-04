import { current } from '@reduxjs/toolkit';
import TextInput from 'components/shared/input/text';
import React, { Suspense, useState } from 'react'
import { create } from 'services/pirate/creator/CreatorController'
import Pack, { PackPrompts } from 'services/pirate/models/Pack'

import { v4 as uuid } from 'uuid';

import styles from 'styles/pages/pirate/creator.module.scss'


type Props = {}

function PirateCreator({ }: Props)
{
    const [pack, setPack] = useState<Pack>(create())

    const [currentPrompt, setPrompt] = useState<PackPrompts>({ uuid: uuid(), title: "", description: "" })

    let prompts = pack.prompts.map((x) =>
    {
        return (
            <div key={x.uuid} className={styles["prompt"]}>
                <h1>{x.title}</h1>
                <p>{x.description}</p>
            </div>
        )
    })

    const onNameChange = (title: string) =>
    {
        pack.settings.name = title
    }

    const onTitleChange = (title: string) =>
    {
        currentPrompt.title = title
        setPrompt(currentPrompt)
    }

    const onDescriptionChange = (description: string) =>
    {
        currentPrompt.description = description
        setPrompt(currentPrompt)

    }

    const addPrompts = () =>
    {
        pack.prompts = [...pack.prompts, currentPrompt];
        setPack(pack)
        setPrompt({ title: currentPrompt.title, description: currentPrompt.description, uuid: uuid() })
    }

    const save = () =>
    {
        const fileName = `pack-${pack.settings.name}`;
        const json = JSON.stringify(pack, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }


    return (
        <>
            <main className={styles["creator"]}>
                <div className={styles["form"]}>
                    <h1>DO NOT REFRESH PAGE</h1>
                    <TextInput label='Pack Name' retriever={onNameChange} placeholder={pack.settings.name} />

                    <TextInput label='Title' retriever={onTitleChange} placeholder={currentPrompt.title} />
                    <div className={styles["description"]}>
                        <label htmlFor="">Description</label>
                        <textarea name="" onChange={e => onDescriptionChange(e.target.value)} placeholder={currentPrompt.description} ></textarea>
                    </div>
                    <div className={styles["buttons"]}>
                        <button onClick={addPrompts}>Add Prompt</button>
                        <button onClick={save}>Save Pack</button>
                    </div>
                    <h2>{pack.prompts.length} Prompts</h2>
                    <div className={styles["prompts"]}>
                        {prompts}
                    </div>
                </div>
            </main>
        </>
    )
}



export default PirateCreator