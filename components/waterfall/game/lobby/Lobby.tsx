import SubmitButton from 'components/shared/input/buttons/submit';
import RangeInput from 'components/shared/input/range';
import SwitchInput from 'components/shared/input/switch';
import TextInput from 'components/shared/input/text';
import React from 'react'
import { useAppSelector } from 'redux/store';
import { getWaterfallPlayerByUUID, selectGame } from 'redux/waterfall/slice';
import { getCurrentGame } from 'services/waterfall/GameController';
import WaterfallCard from '../card/WaterfallCard';
import User from '../user';
import UserList from '../userlist';

import styles from './lobby.module.scss';

type Props = {}

function Lobby({ }: Props)
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

function CardStack()
{
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
                    description: `Welcome $user!\nThe Game will start soon!\n\nWhilst you wait, check out the help button to view the deck and it's rules`
                }}
                flipSettings={{ clickable: false, onCreation: { flip: true, delay: 0 } }}
            />
        </div>
    )
}

function Settings()
{
    const game = useAppSelector(selectGame);
    const gameOwner = getWaterfallPlayerByUUID(game.ownerId);
    const minPlayers = Object.keys(game.players.users).length;

    const startGame = () =>
    {
        getCurrentGame().sendStartRequest();
    }

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
                        <User
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
                        <SwitchInput label='Hidden?' />
                        <SwitchInput label='Enable Actions?' />
                        <SwitchInput label='Random Order?' />
                    </div>

                    <div className={styles["waterfall-lobby__settings__row"]}>
                        <RangeInput label='%value Players' min={minPlayers} max={8} defValue={8} />
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