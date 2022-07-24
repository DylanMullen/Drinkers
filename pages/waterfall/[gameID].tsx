import ControlButton from 'components/waterfall/game/buttons/control-btn/ControlButton';
import WaterfallPlayingCard, { CardOwner } from 'components/waterfall/game/card/WaterfallCard';

import { BsQuestionLg } from 'react-icons/bs'
import { FaChevronLeft, FaLink } from 'react-icons/fa'

import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import styles from 'styles/pages/waterfall/game.module.scss'
import RuleModal from 'components/waterfall/game/modals/rule-modal/RuleModal';
import UserList from 'components/waterfall/game/userlist';
import { WaterfallCard, WaterfallModal, WaterfallPlayer } from 'redux/waterfall/types';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getWaterfallPlayerByUUID, getWaterfallPlayers, openModal, selectCard, selectGame, selectGameName, selectHiddenBack, selectKicked, selectLobby, selectMechanics, selectModal, selectNextPlayer, selectRules, selectStarted, updateModal, updateNextTurnButton } from 'redux/waterfall/slice';
import Head from 'next/head';
import DateModal from 'components/waterfall/game/modals/date-modal';
import { GiRuleBook } from 'react-icons/gi';
import { getCurrentGame, joinWaterfallGame } from 'services/waterfall/GameController';
import { GetServerSidePropsContext } from 'next';
import RuleList from 'components/waterfall/game/rule-list';
import { getUser, User } from 'utils/UserUtil';
import HelpModal from 'components/waterfall/game/modals/help-modal';
import StartMenu from 'components/waterfall/game/start-menu';
import WildcardModal from 'components/waterfall/game/modals/wildcard-modal';
import Backdrop from 'components/shared/backdrop/Backdrop';
import { Error } from 'components/waterfall/lobby/modals/join/JoinModal';
import Lobby from 'components/waterfall/game/lobby';

type Props = {
    gameID: string
}


function WaterfallGame({ gameID }: Props)
{

    const router = useRouter();

    const back = (): void =>
    {
        getCurrentGame().socket.close();
        router.push("/waterfall", "/waterfall")
    }

    const skip = () =>
    {
        getCurrentGame().sendSkipTurnRequest();
    }

    const [isLoaded, setLoaded] = useState(false)
    const [user, setUser] = useState<User>()

    const dispatch = useAppDispatch();

    let gameName = useAppSelector(selectGameName)

    let hiddenBack = useAppSelector(selectHiddenBack);
    let started = useAppSelector(selectStarted)
    let card = useAppSelector(selectCard);

    let kicked = useAppSelector(selectKicked);

    let playingCard = getWaterfallCard(card, hiddenBack, () =>
    {
        dispatch(openModal())
        dispatch(updateNextTurnButton())

    });

    let isRed = card.suite == 0 || card.suite == 1;

    let isNextPlayerEnabled = useAppSelector(selectNextPlayer) === user?.uuid && card.nextTurn !== undefined

    const copyLink = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        let url = URL + "/waterfall/" + getCurrentGame().gameCode;

        navigator.clipboard.writeText(url)
    }

    useEffect(() =>
    {
        if (kicked)
        {
            setLoaded(false)
            router.push("/waterfall")
        }
    }, [kicked, router])

    useEffect(() =>
    {
        router.beforePopState(({ as }) =>
        {
            if (as !== router.asPath)
            {
                getCurrentGame().socket.close()
            }
            return true;
        });

    }, [router])

    const connect = useCallback(async () =>
    {
        const user = getUser();

        setUser(user);

        let response = await joinWaterfallGame({
            joinCode: gameID,
            player: {
                uuid: user.uuid,
                username: user.username,
                avatar: user.avatar
            }
        });
        if (response as Error && (response as Error).message !== undefined)
        {
            router.push("/waterfall", "", { shallow: true })
        }
        else
            setLoaded(true);
    }, [gameID, router])
    useEffect(() =>
    {
        connect();
    }, [connect])

    const next = () =>
    {
        if (getCurrentGame() === undefined)
            return;
        getCurrentGame().sendNextTurnRequest();
    }

    return (
        isLoaded && !kicked &&
        <>
            <Head>
                <title>{gameName} | Drinkers</title>
                <meta name="robots" content="noindex" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <meta name="title" content={`${gameName} | Drinkers"`} />
                <meta name="description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
                <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, still site, the still site, card game, cards, playing cards, alcohol" />
                <meta name="url" content="https://drinkers.beer/waterfall" />

                <meta name="og:title" content={`${gameName} | Drinkers"`} />
                <meta name="og:site_name" content="Drinkers Beer" />
                <meta name="og:type" content="website" />
                <meta name="og:url" content="https://drinkers.beer/waterfall" />
                <meta name="og:description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
            </Head>

            <ModalWrapper />


            <div className={styles["waterfall-toolbar"] + " " + styles["waterfall-toolbar--left"]}>
                <button className={styles["waterfall-toolbar__btn"]} onClick={back}>
                    <FaChevronLeft />
                </button>
            </div>

            <div className={styles["waterfall-toolbar"] + " " + styles["waterfall-toolbar--right"]}>
                <button className={styles["waterfall-toolbar__btn"]}
                    onClick={(e) => { e.currentTarget.blur(); dispatch(updateModal({ type: 2, show: true, content: {} })) }}
                >
                    <BsQuestionLg />
                </button>

                <button className={styles["waterfall-toolbar__btn"]} onClick={copyLink}>
                    <FaLink />
                </button>

                <RuleToolbarButton />

            </div>
            {
                !started ?
                    <Lobby /> :
                    <>
                        <main className={styles["waterfall-game"]} data-color={isRed && started ? "red" : "black"}>
                            <div className={styles["waterfall-game__card"]}>
                                <div className={styles["waterfall-game__skip"]}>
                                    <ControlButton
                                        icon="🕒"
                                        text="Skip Turn"
                                        callback={skip}
                                    />
                                </div>
                                <div className={styles["waterfall-game__card__wrapper"]}>
                                    {playingCard}
                                </div>

                                <div className={styles["waterfall-game__next"]}>
                                    <ControlButton
                                        icon="🍺"
                                        text="Next Turn"
                                        callback={next}
                                        disabled={!isNextPlayerEnabled}
                                    />
                                </div>
                            </div>

                        </main>
                        <footer className={styles["waterfall-footer"]} data-color={isRed ? "red" : "black"}>
                            <UserList />
                        </footer>
                    </>
            }


        </>
    )
}

function getWaterfallCard(card: WaterfallCard, hiddenBack: boolean, flipCallback: Function): React.ReactNode
{
    if (card.finished !== undefined)
        return undefined;


    let player = getWaterfallPlayerByUUID(card.creatorUUID);

    let cardOwner: CardOwner | undefined = player ? {
        uuid: card.creatorUUID,
        username: player.username,
        avatar: player.avatar
    } : undefined;


    return <WaterfallPlayingCard
        cardDetails={{
            face: card.face,
            suite: card.suite,
            hidden: hiddenBack,
            cardOwner: cardOwner
        }}
        ruleDetails={{ title: card.details.title, description: card.details.description }}
        flipSettings={{
            clickable: false,
            callback: flipCallback,
            onCreation: {
                flip: true,
                delay: 750
            },
            onUpdate: {
                flip: true,
                delay: 750
            }
        }}
    />
}


function ModalWrapper()
{
    let modalState = useAppSelector(selectModal);
    let modal: React.ReactNode = getModal(getCurrentGame().closeModal, modalState);

    return (
        <>
            {
                modalState?.show &&
                <Backdrop closeCallback={getCurrentGame().closeModal}>
                    {modal}
                </Backdrop>
            }
        </>
    )
}

function getModal(close: Function, modal: WaterfallModal | undefined): React.ReactNode
{
    if (modal === undefined)
        return undefined;
    switch (modal.type)
    {
        case 0: {
            return <DateModal dates={modal.content.dates} players={modal.content.players} closeCallback={close} />
        }
        case 1: {
            return <RuleModal suggestions={modal.content.suggestions} closeCallback={close} />
        }
        case 2: {
            return <HelpModal />
        }
        case 3: {
            return <WildcardModal cards={modal.content.cards} />
        }
        default: {
            return undefined;
        }
    }

}

function RuleToolbarButton()
{
    const [show, setShow] = useState(false);

    let rules = useAppSelector(selectRules);

    useEffect(() =>
    {
        if (Object.keys(rules).length === 0)
            return;

        setShow(true);

        setTimeout(() =>
        {
            setShow(false)

        }, 1500)

    }, [rules])

    let clazzName = styles["waterfall-toolbar__rules"] + " " + (show ? styles["waterfall-toolbar__rules--show"] : "")

    return (
        <div className={clazzName}>
            <button className={styles["waterfall-toolbar__btn"]}>
                <GiRuleBook />
            </button>
            <div className={styles["waterfall-toolbar__rules__wrapper"]}>
                <RuleList />
            </div>
        </div>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext)
{
    const { gameID } = context.query

    return {
        props: {
            gameID: gameID as string
        }
    }
}

export default WaterfallGame