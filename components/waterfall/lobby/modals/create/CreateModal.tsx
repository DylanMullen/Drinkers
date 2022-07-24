import SubmitButton from 'components/shared/input/buttons/submit'
import InputGroup from 'components/shared/input/input-group'
import RangeInput from 'components/shared/input/range'
import SwitchInput from 'components/shared/input/switch'
import TextInput from 'components/shared/input/text'
import Modal, { ModalCustomScheme } from 'components/shared/modal/Modal'
import { getCookie } from 'cookies-next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { HiOutlinePencilAlt as CreateIcon } from 'react-icons/hi'
import { createWaterfallGame } from 'services/waterfall/GameController'
import { getUser, User } from 'utils/UserUtil'
import Profile from '../../profile'

import styles from './create-modal.module.scss'

type Props = {

    close: Function

}

function CreateModal({ close }: Props)
{

    const [user, setUser] = useState<User>()

    const customScheme: ModalCustomScheme = {
        accent: "#9cc12f",
        icon: "#a6d31f",
        text: "white"
    }

    const [gameName, setName] = useState("");
    const [hiddenBack, setHiddenBack] = useState(false);
    const [maxPlayers, setPlayers] = useState(8);

    const router = useRouter();

    let cookie = getCookie("user") as string;
    let cookieJSON = cookie !== undefined ? JSON.parse(cookie) : undefined;

    const submit = async () =>
    {
        // let uuid = await createWaterfallGame({
        //     owner: {
        //         uuid: cookieJSON.uuid,
        //         username: cookieJSON.username,
        //         avatar: cookieJSON.avatar
        //     },
        //     settings: {
        //         gameName: gameName.length === 0 ? "Waterfall" : gameName,
        //         hiddenBack,
        //         maxPlayers,
        //     }
        // })
        close(-1)
        // router.push("/waterfall/" + uuid, "", {
        //     shallow: true
        // })
    }

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    return (
        <>
            {
                user &&
                <Modal closeBtn closeClbck={close} customColors={customScheme} icon={<CreateIcon />}>
                    <div className={styles["waterfall-createmodal"]}>

                        {/* <hr className={styles["waterfall-createmodal__seperator"]} /> */}
                        <div className={styles["waterfall-createmodal__body"]}>
                            <h1 className={styles["waterfall-createmodal__title"]}>New Game</h1>
                            <div className={styles["waterfall-createmodal__header"]}>
                                <Profile
                                    username={user?.username ?? "Guest"}
                                    avatar={user?.avatar ?? "https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512"}
                                    open={() => close(2)}
                                />
                                <hr />
                                <SubmitButton clickCallback={submit} />

                            </div>
                            <form className={styles["waterfall-createmodal__form"]}>
                                <TextInput label="Game Name" retriever={setName} />
                                <RangeInput label="%value Players" defValue={8} max={8} changeCallback={setPlayers} />
                                <InputGroup columns={2}>
                                    <SwitchInput label="Hidden Back" changeCallback={setHiddenBack} />
                                </InputGroup>

                            </form>
                        </div>

                    </div>
                </Modal>
            }
        </>
    )
}

export default CreateModal