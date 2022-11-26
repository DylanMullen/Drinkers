import Modal from 'components/shared/modal/Modal'
import { getCookie } from 'cookies-next';
import React, { useId } from 'react'
import { IoHeart } from 'react-icons/io5'
import { useAppDispatch } from 'redux/store';
import { getWaterfallPlayerByUUID, updateModal } from 'redux/waterfall/slice';
import { WaterfallDate, WaterfallPlayer } from 'redux/waterfall/types'
import Game from 'services/waterfall/Game';
import { getCurrentGame } from 'services/waterfall/GameController';
import { uuid } from "uuidv4"
import Date from '../../date/Date';

import styles from './date-modal.module.scss';

type Props = {
    players: WaterfallPlayer[],
    dates: any,
    closeCallback?: Function
}

type DateOwners = {
    [id: string]: WaterfallPlayer[]
}

function DateModal({ players, dates, closeCallback = () => { } }: Props)
{
    let dateId = useId();
    let currentDates = getCurrentDates(dates, dateId);

    const dispatch = useAppDispatch();

    let cookie = getCookie("user") as string;
    let cookieJSON = cookie !== undefined ? JSON.parse(cookie) : undefined;

    const addDate = (date: string) =>
    {
        getCurrentGame().sendDateRequest({
            owner: cookieJSON.uuid,
            date: date
        })

        dispatch(updateModal(undefined))
    }
    
    let playerCards = getPlayerCards(addDate, getUndatedPlayers(cookieJSON.uuid, players, dates), cookieJSON.uuid);

    let dateColumns = currentDates.length >= 4 ? 4 : currentDates.length;
    let playerColumns = playerCards.length >= 3 ? 3 : playerCards.length

    return (
        <Modal
            icon={<IoHeart />}
            customColors={
                {
                    accent: "#ff4d6d",
                    icon: "#ff8fa3",
                    text: "white"
                }
            }
            horizontal
            title="Pick a Date"
            closeBtn
            closeClbck={closeCallback}
        >
            <div className={styles["waterfall-datemodal"]}>
                <div className={styles["waterfall-datemodal__body"]} data-column={playerColumns}>
                    {
                        currentDates.length !== 0 &&
                        <>
                            <div className={styles["waterfall-datemodal__current"]} data-columns={dateColumns}>
                                <h2 className={styles["waterfall-datemodal__subtitle"]}>Current Date Owners</h2>

                                <div className={styles["waterfall-datemodal__current__dates"]} >
                                    {currentDates}
                                </div>
                            </div>
                            <hr className={styles['waterfall-datemodal__seperator']} />
                        </>

                    }
                    <div className={styles["waterfall-datemodal__players"]} data-columns={playerColumns}>
                        <h2 className={styles["waterfall-datemodal__subtitle"]}>Pick a Date</h2>
                        <div className={styles["waterfall-datemodal__players__list"]}>
                            {
                                playerCards.length === 0 ?
                                    <h3 className={styles["waterfall-datemodal__error"]}>You cannot date anyone</h3> : playerCards
                            }
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    )
}

function getCurrentDates(dates: WaterfallDate[], id: string): React.ReactNode[]
{

    let dateOwners: DateOwners = getDateOwners(dates);
    let x = 0;

    let response: React.ReactNode[] = []

    Object.keys(dateOwners).forEach(owner =>
    {
        let player = getWaterfallPlayerByUUID(owner);
        if (!player)
            return;

        response.push(<Date key={id + "-" + x} owner={player} dates={dateOwners[owner]} showDates />)
    })

    return response;
}

function getDateOwners(dates: WaterfallDate[]): DateOwners
{
    let response: DateOwners = {}
    for (let x = 0; x < Object.keys(dates).length; x++)
    {
        const dateOwner = dates[x].owner;
        let player = getWaterfallPlayerByUUID(dates[x].date);
        if (!player)
            continue

        if (response[dateOwner] !== undefined)
            response[dateOwner].push(player);
        else
            response[dateOwner] = [player]
    }

    return response;

}

function getPlayerCards(addDate: Function, players: WaterfallPlayer[], userID: string): React.ReactNode[]
{
    let response: React.ReactNode[] = []

    for (let x = 0; x < players.length; x++)
    {
        const player = players[x];
        if (player.uuid === userID)
            continue;

        response.push(
            <Date key={uuid()} owner={player} dates={[]} showDates={false} clickCallback={() =>
            {
                addDate(player.uuid)
            }} />
        )
    }

    return response;
}

function getUndatedPlayers(userID: string, players: WaterfallPlayer[], dates: WaterfallDate[]): WaterfallPlayer[]
{

    let response: WaterfallPlayer[] = []

    outer:for (let player in players)
    {
        let wPlayer = players[player];

        for (let index = 0; index < Object.keys(dates).length; index++)
        {
            const date = dates[index];
            if (date.owner === userID && date.date === wPlayer.uuid){
                continue outer
            };
        }
        response.push(wPlayer);

    }

    return response;

}

export default DateModal