import SubmitButton from 'components/shared/input/buttons/submit';
import { setCookie } from 'cookies-next';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IoDiceSharp, IoSaveSharp } from 'react-icons/io5'
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
    const [user, setUser] = useState<User>();
    const [avatar, setAvatar] = useState("https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512");
    const [username, setUsername] = useState(randomName());

    const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(() => e.target.value);
    const diceClick = () => setUsername(() => randomName());

    const click = () => callback(username, avatar, uuid());


    useEffect(() =>
    {
        if (!hydrate)
            return;

        let user = getUser();
        setUser(user)
        setAvatar(user.avatar)
        setUsername(user.username)
    }, [])

    return (
        <div className={styles["profile-editor"]}>
            <div className={styles["profile-editor__avatar"]}>
                <div className={styles["profile-editor__avatar__selected"]}>
                    <Image priority src={avatar} alt={`Selected Avatar`} width="100%" height={"100%"} />

                </div>
                <div className={styles["profile-editor__avatar__options"]}>
                    <ProfileAvatar url="https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512" callback={setAvatar} />
                    <ProfileAvatar url="https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512" callback={setAvatar} />
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