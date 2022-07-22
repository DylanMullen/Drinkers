import Modal from 'components/shared/modal'
import React, { useCallback, useEffect, useState } from 'react'
import { BsQuestionLg } from 'react-icons/bs'
import { CgDetailsLess } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'redux/store'
import { selectGame, updateModal } from 'redux/waterfall/slice'
import WaterfallPlayingCard, { CardDetails, RuleDetails } from '../../card/WaterfallCard'

import styles from './help-modal.module.scss';

type Props = {}

type CardButtonProps = {
    face: number,
    request(face: number): void
}

function HelpModal({ }: Props)
{
    const [cardSettings, setCardSettings] = useState<CardDetails>({ face: 0, hidden: false, suite: 0 });
    const [cardDetails, setCardDetails] = useState<RuleDetails>({ title: "", description: "" });

    const [useModifier, setModifier] = useState(false);


    const dispatch = useAppDispatch();

    const close = () => { dispatch(updateModal(undefined)) }

    let gameID = useAppSelector(selectGame).gameId;

    const request = async (face: number, modifier?: boolean) =>
    {
        let response = await requestCardValue(gameID, face, cardSettings.suite, modifier ?? useModifier);

        setCardSettings(prev =>
        {
            return {
                ...prev,
                face: face
            }
        })
        setCardDetails(response.details)
    }

    const disableModifer = async (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        setModifier(false);
        await request(cardSettings.face, false)

        setCardSettings(prev =>
        {
            return {
                ...prev,
                suite: 0
            }
        })
    }

    const changeModifier = async () =>
    {
        let suite = cardSettings.suite !== 0 ? 0 : 2

        let response = await requestCardValue(gameID, cardSettings.face, suite, true)

        setModifier(true)
        setCardSettings(prev =>
        {
            return {
                ...prev,
                suite: suite
            }
        })
        setCardDetails(response.details)
    }

    useEffect(() =>
    {
        request(0);
    }, [])

    let cards = [];

    for (let index = 0; index < 13; index++)
        cards.push(<CardButton face={index} request={request} />)



    return (
        <Modal
            horizontal
            closeBtn
            customColors={{
                accent: '#5e60ce',
                icon: "#5390d9",
                text: "white"
            }}
            icon={<BsQuestionLg />}
            title="Waterfall"
            closeClbck={close}
        >
            <div className={styles["help-modal"]}>
                <div className={styles["help-modal__content"]}>

                    <section className={styles["help-modal__card"]}>

                        <div className={styles["help-modal__card__wrapper"]}>
                            <WaterfallPlayingCard
                                cardDetails={cardSettings}
                                ruleDetails={cardDetails}
                            />
                        </div>
                        <div className={styles["help-modal__suite-selector"]}>
                            <button className={styles["help-modal__suite-selector__btn"]}
                                onClick={disableModifer}
                            />
                            <button className={styles["help-modal__suite-selector__btn"] + " " + styles["help-modal__suite-selector__btn--modifier"]}
                                onClick={changeModifier}
                            />
                        </div>
                    </section>
                    <section className={styles["help-modal__info-panel"]}>
                        <p className={styles["help-modal__info-panel__info"]}>
                            Sometimes people like to know what they are getting into.<br />
                            If that&apos;s you, this tool will help you find out the rules of the deck.<br />
                            Simply select the card you want information on and read!
                        </p>
                        <ul className={styles["help-modal__card-selector"]}>
                            {cards}
                        </ul>
                    </section>
                </div>
            </div>
        </Modal>
    )
}

function CardButton({ face = 0, request = (face: number) => { } }: CardButtonProps)
{
    return (
        <li >
            <button className={styles["help-modal__card-selector__btn"]} onClick={() => request(face)}>{getFaceValue(face)}</button>
        </li>
    )
}

function getFaceValue(face: number): string
{
    switch (face)
    {
        case 0: return "Ace"
        case 1: return "Two"
        case 2: return "Three"
        case 3: return "Four"
        case 4: return "Five"
        case 5: return "Six"
        case 6: return "Seven"
        case 7: return "Eight"
        case 8: return "Nine"
        case 9: return "Ten"
        case 10: return "Jack"
        case 11: return "Queen"
        case 12: return "King"
        default: return ""
    }
}

async function requestCardValue(gameID: string, face: number, suite: number, modifier: boolean)
{
    let response: any = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/waterfall/game/" + gameID + "/card", {
        method: "POST",
        body: JSON.stringify({
            face: face,
            suite: suite,
            modifier: modifier
        })
    }).then(res => res.json())

    if (!response)
        return;

    return response;
}


export default HelpModal