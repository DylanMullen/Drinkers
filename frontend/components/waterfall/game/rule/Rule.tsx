import { getCookie } from 'cookies-next';
import React from 'react'
import { HiOutlineChevronRight } from 'react-icons/hi';
import { getCurrentGame } from 'services/waterfall/GameController';
import { uuid } from 'uuidv4';

import styles from './rule.module.scss';

type Props = {
    title: string,
    text: string,
    rating?: number
}

function Rule({ title, text }: Props)
{
    let cookie = getCookie("user") as string;
    let cookieJSON = cookie !== undefined ? JSON.parse(cookie) : undefined;


    const click = () =>
    {
        getCurrentGame().sendRuleRequest({
            uuid: uuid(),
            creator: cookieJSON.uuid,
            rule: text
        })

        getCurrentGame().closeModal()
    }

    return (
        <div className={styles["waterfall-rule"]} onClick={click}>
            <div className={styles["waterfall-rule__body"]}>
                <h1 className={styles["waterfall-rule__title"]}>{title}</h1>
                <p className={styles["waterfall-rule__text"]}>{text}</p>
            </div>
        </div>
    )
}

export default Rule