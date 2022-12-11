import SubmitButton from 'components/shared/input/buttons/submit';
import RangeInput from 'components/shared/input/range';
import SwitchInput from 'components/shared/input/switch';
import TextInput from 'components/shared/input/text';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/store';
import { getWaterfallPlayerByUUID, selectGame, selectMechanics, selectPlayers } from 'redux/waterfall/slice';
import { getCurrentGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';
import WaterfallCard from '../card/WaterfallCard';
import UserCard from '../user';
import UserList from '../userlist';

import styles from './lobby.module.scss';



function Lobby()
{
    return (
        <>
            <div className={styles["waterfall-lobby"]}>
                <main className={styles["waterfall-lobby__content"]}>
                    <CardStack />
                    <Settings />
                </main>

                <footer className={styles["waterfall-lobby__footer"]}>
                    <UserList lobby />
                </footer>
            </div>
        </>
    )
}

export function CardStack()
{
    const [user, setUser] = useState<User>();

    useEffect(() => { setUser(getUser()) }, [])

    return (
        <div className={styles["waterfall-lobby__cardstack"]}>
            <WaterfallCard
                cardDetails={{ face: 0, suite: 0, hidden: true }}
                ruleDetails={{ description: "", title: "" }}
                flipSettings={{ clickable: false }}
            />
            <WaterfallCard
                cardDetails={{ face: 0, suite: 0, hidden: true }}
                ruleDetails={{ description: "", title: "" }}
                flipSettings={{ clickable: false }}
            />
            <WaterfallCard
                cardDetails={{ face: 0, suite: 2, hidden: true }}
                ruleDetails={{
                    title: "Waterfall",
                    description: `Welcome ${user?.username ?? "Guest"}!\nThe Game will start soon!\n\nWhilst you wait, check out the help button to view the deck and it's rules`
                }}
                flipSettings={{ clickable: false, onCreation: { flip: true, delay: 0 } }}
            />
        </div>
    )
}

function Settings()
{
    const [user, setUser] = useState<User>()

    const game = useAppSelector(selectGame);
    const gameOwner = getWaterfallPlayerByUUID(game.ownerId);
    const mechanics = useAppSelector(selectMechanics);
    const players = useAppSelector(selectPlayers);
    const minPlayers = Object.keys(game.players.users).length;

    const startGame = () =>
    {
        getCurrentGame().sendStartRequest();
    }

    const updateSetting = (value: any, setting: string) =>
    {
        getCurrentGame().sendUpdateSetting(setting, value);
    }

    useEffect(() => { setUser(getUser()) }, [])

    const disabled = (user?.uuid ?? "") !== game.ownerId

    return (
        <section className={styles["waterfall-lobby__settings"]}>
            <header className={styles["waterfall-lobby__settings__header"]}>
                <h1 className={styles["waterfall-lobby__settings__title"]}>{game.gameName}</h1>
            </header>
            <div className={styles["waterfall-lobby__settings__body"]}>
                <div className={styles["waterfall-lobby__settings__row"]}>
                    <div className={styles["waterfall-lobby__settings__owner"]}>
                        <span className={styles["waterfall-lobby__settings__subtitle"]}>Owner</span>
                        <hr className={styles["waterfall-lobby__settings__divider"]} />
                        <UserCard
                            user={{ username: gameOwner?.username ?? "Guest", avatar: gameOwner?.avatar ?? "", uuid: gameOwner?.uuid ?? "" }}
                            settings={{ dummy: true }}
                        />
                    </div>
                </div>
                <div className={`${styles["waterfall-lobby__settings__row"]} ${styles["waterfall-lobby__settings__row--vertical"]}`}>
                    <div className={styles["waterfall-lobby__settings__row"]}>
                        <span className={styles["waterfall-lobby__settings__subtitle"]}>Options</span>
                    </div>
                    <hr className={styles["waterfall-lobby__settings__divider"]} />
                    <div className={styles["waterfall-lobby__settings__row"]}>
                        <SwitchInput
                            label='Hidden?'
                            defaultValue={mechanics.hiddenBack}
                            disabled={disabled}
                            changeCallback={(e: boolean) => { updateSetting(e, "hiddenBack") }} />
                        <SwitchInput
                            label='Enable Actions?'
                            defaultValue={mechanics.actions}
                            disabled={disabled}

                            changeCallback={(e: boolean) => { updateSetting(e, "enableActions") }} />
                        {/* <SwitchInput label='Random Order?' defaultValue={true} changeCallback={(e:boolean)=>{updateSetting(e, "hiddenBack")}}/> */}
                    </div>

                    <div className={styles["waterfall-lobby__settings__row"]}>
                        <RangeInput
                            label='%value Players' min={minPlayers} max={8} defValue={players.max}
                            disabled={disabled}
                            changeCallback={(e: string) => { updateSetting(e, "maxPlayer") }} />
                    </div>
                </div>
            </div>
            <footer className={styles["waterfall-lobby__settings__footer"]}>
                <SubmitButton text='Start Game' textColor='white' clickCallback={startGame} />
            </footer>
        </section>
    )
}
export default Lobby