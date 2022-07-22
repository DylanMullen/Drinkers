import Image from 'next/image'
import React, { useId } from 'react'
import { useAppSelector } from 'redux/store'
import { getWaterfallPlayerByUUID, selectMechanics } from 'redux/waterfall/slice'

import styles from './rule-list.module.scss'

type Props = {}

type RuleItemProps = {
    rule: string
    username: string
    avatar: string
}

function RuleList({ }: Props)
{
    let rules = useAppSelector(selectMechanics).rules

    let id = useId();

    let ruleItems: React.ReactNode[] = []

    for (let index = 0; index < Object.keys(rules).length; index++)
    {
        let rule = rules[index];

        let owner = getWaterfallPlayerByUUID(rule.creator);

        ruleItems.push(<RuleItem key={id + "-" + index}
            username={owner?.username ?? "Guest"} avatar={owner?.avatar ?? "https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512"}
            rule={rule.rule} />)

    }

    return (
        <div className={styles["waterfall-rulelist"]}>
            <div className={styles["waterfall-rulelist__body"]}>
                <h1 className={styles["waterfall-rulelist__title"]}>Rules</h1>
                {
                    ruleItems.length === 0 &&
                    <h2 className={styles["waterfall-rulelist__subtitle"]}>No Rules Yet!<br />Keep playing for rules!</h2>
                }
                <ul className={styles["waterfall-rulelist__list"]}>{ruleItems}</ul>
            </div>

            <span className={styles["waterfall-rulelist__footer"]} />
        </div>
    )
}

function RuleItem({ rule, username, avatar }: RuleItemProps)
{
    return (
        <li className={styles["waterfall-rulelist__item"]}>

            <div className={styles["waterfall-rulelist__item__user"]}>

                <div className={styles["waterfall-rulelist__item__avatar"]}>
                    <Image src={avatar} width={"100%"} height={"100%"} alt={`Avatar of ${username}`}/>
                </div>
                <span className={styles["waterfall-rulelist__item__name"]}>{username}</span>
            </div>
            {rule}
        </li>
    )
}
export default RuleList