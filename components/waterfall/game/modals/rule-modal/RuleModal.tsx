import Modal from 'components/shared/modal/Modal'
import { getCookie } from 'cookies-next';
import React, { useState } from 'react'
import { GiRuleBook } from 'react-icons/gi'
import { HiOutlineChevronRight } from 'react-icons/hi';
import { getCurrentGame } from 'services/waterfall/GameController';
import { uuid } from 'uuidv4';
import { RuleDetails } from '../../card/WaterfallCard';
import Rule from '../../rule/Rule'

import styles from './rule-modal.module.scss';

type Props = {
    suggestions: {
        [id: number]: RuleDetails
    }
    closeCallback?: Function
}

function RuleModal({ suggestions, closeCallback = () => { } }: Props)
{
    const [rule, setRule] = useState("");

    let rules: React.ReactNode[] = []

    for (let i = 0; i < Object.keys(suggestions).length; i++)
    {
        let rule = suggestions[i]
        rules.push(
            <Rule key={uuid()} title={rule.title} text={rule.description} />
        )
    }


    let cookie = getCookie("user") as string;
    let cookieJSON = cookie !== undefined ? JSON.parse(cookie) : undefined;

    return (
        <Modal
            icon={<GiRuleBook />}
            customColors={
                {
                    accent: "#faa307",
                    icon: "#f48c06",
                    text: "white"
                }
            }
            closeBtn
            closeClbck={closeCallback}
        >
            <div className={styles["waterfall-rulemodal"]}>
                <h1 className={styles["waterfall-rulemodal__title"]}>Add a Rule</h1>

                <div className={styles["waterfall-rulemodal__rules"]}>
                    {rules}
                </div>

                <hr className={styles["waterfall-rulemodal__split"]} />
                <div className={styles["waterfall-rulemodal__create"]}>
                    <textarea className={styles["waterfall-rulemodal__create__input"]} id="" maxLength={128}
                        value={rule}
                        onChange={
                            (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            {
                                setRule(e.target.value)
                            }
                        } />
                    <button className={styles["waterfall-rulemodal__create__btn"]} onClick={() =>
                    {
                        getCurrentGame().sendRuleRequest({
                            uuid: "",
                            creator: cookieJSON.uuid,
                            rule: rule
                        })

                        getCurrentGame().closeModal()
                    }}><HiOutlineChevronRight /></button>
                </div>

            </div>

        </Modal>
    )
}

export default RuleModal