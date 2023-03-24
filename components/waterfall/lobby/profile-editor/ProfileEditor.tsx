import SubmitButton from 'components/shared/input/buttons/submit';
import useUser from 'context/UserContext';
import { setCookie } from 'cookies-next';
import Image from 'next/image'
import React, { MouseEvent, useEffect, useState } from 'react'
import { IoDiceSharp, IoSaveSharp } from 'react-icons/io5'
import { getRandomAvatar, getRandomName } from 'utils/NameUtil';
import { getUser, User } from 'utils/UserUtil';
import { uuid } from 'uuidv4';

import styles from './profile-editor.module.scss'

const PREFIXES: string[] = ["Drunk", "Sober", "Cold", "Warm", "Fruity", "Foaming", "Hard", "Mild", "Fermented", "Dirty", "Cloudy"];
const NOUNS: string[] = ["Apple", "Grape", "Vodka", "Whiskey", "Brandy", "Rum", "Gin", "Seltzer", "Pear", "Banana", "Cane"];

type Props = {
    callback: Function,
    hydrate: boolean,
    text?: string
}

type ProfileAvatarProps = {
    url: string,
    callback: Function
}

function ProfileEditor({ callback, hydrate, text }: Props)
{
    const { user } = useUser();
    const [avatars, setAvatars] = useState([
        getRandomAvatar(getRandomName()),
        getRandomAvatar(getRandomName()),
        getRandomAvatar(getRandomName())
    ])
    const [username, setUsername] = useState(randomName());

    const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(() => e.target.value);
    const diceClick = () =>
    {
        let temp = randomName();
        setUsername(() => temp)
        setAvatars(prev=>{
            prev[1] = getRandomAvatar(temp)
            prev[2] = getRandomAvatar(temp)
            return [...prev]
        })
    };

    const click = (e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); callback(username, avatars[0], uuid()); }

    const updateAvatars = (index: number) =>
    {
        setAvatars(prev =>
        {
            let temp = prev[0]
            prev[0] = prev[index]
            prev[index] = temp

            return [...prev]
        })
    }


    useEffect(() =>
    {
        if (!hydrate || !user)
            return;

        setUsername(user.username)

        setAvatars(prev =>
        {
            prev[0] = user.avatar
            return [...prev]
        })
    }, [])

    return (
        <div className={styles["profile-editor"]}>
            <div className={styles["profile-editor__avatar"]}>
                <div className={styles["profile-editor__avatar__selected"]}>
                    <Image priority src={avatars[0]} alt={`Selected Avatar`} width="100%" height={"100%"} />

                </div>
                <div className={styles["profile-editor__avatar__options"]}>
                    <ProfileAvatar url={avatars[1]} callback={() => updateAvatars(1)} />
                    <ProfileAvatar url={avatars[2]} callback={() => updateAvatars(2)} />
                </div>
            </div>
            <div className={styles["profile-editor__body"]}>
                <div className={styles["profile-editor__username"]}>
                    <input className={styles["profile-editor__username__input"]}
                        maxLength={16} onChange={usernameChange}
                        type="text" defaultValue={user?.username ?? username} value={username} autoFocus
                    />
                    <button className={styles["profile-editor__dice"]} onClick={diceClick}>
                        <IoDiceSharp />
                    </button>
                </div>
                <button className={styles["profile-editor__submit"]} onClick={click}>{text ?? "Save"}</button>
            </div>
        </div>
    )
}

function ProfileAvatar({ url, callback }: ProfileAvatarProps)
{
    const click = (): void => { callback(url) }

    return (
        <button className={styles["profile-editor__avatar__option"]} onClick={click}>
            <Image src={url} priority width={"100%"} height={"100%"} alt={`Possible Avatar Selection`} />
        </button>
    )
}

export function randomName(): string
{
    let prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    let noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return prefix + noun;
}


export default ProfileEditor