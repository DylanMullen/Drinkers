import Modal from 'components/shared/modal'
import React from 'react'
import { BiCookie } from 'react-icons/bi';
import { handleCookieResponse } from 'services/cookies/CookieManager';

import styles from './cookie-modal.module.scss';

type Props = {
    close: Function
}

const message =
    `
Other cookies that we use, that are not deemed essential, are analytical. We utilise Google’s Analytics platform to determine our website audience. This is 100% optional and can be opt-out.

We value the data rights of individuals that use our site. We will never use your data without your consent. To learn about your rights, click me! For further information regarding our usage of your data, contact us at data@stillsite.net

We are not the cookie monster! Your cookies are yours!
Still Site Limited
`

function CookieModal({ close }: Props)
{
    let gdpr = "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/individual-rights/"

    const accepted = (accepted: boolean) => { handleCookieResponse(accepted); close() }

    return (
        <Modal
            icon={<BiCookie />}
            title='Cookies'
            closeBtn
            closeClbck={close}
            customColors={{
                accent: "#84563C",
                icon: "#a67052",
                text: "white"
            }}
        >
            <div className={styles["cookie-modal"]}>
                <h2 className={styles["cookie-modal__title"]}>We use Cookies!</h2>
                <p className={styles["cookie-modal__info"]}>
                    Under the Data Protection Act (2018), which implemented the EU GDPR directive, we are required to ensure that you are comfortable with this decision. By law, we are allowed to use essential cookies to keep the website oil and greased. We implement this by only utilising features pertinent to making sure your experience is smooth and 100% available at any given time, such as authentication data.
                    Other cookies that we use, that are not deemed essential, are analytical. We utilise Google’s Analytics platform to determine our website audience. This is 100% optional and can be opt-out.
                    <br /><br />
                    We value the data rights of individuals that use our site. We will never use your data without your consent. To learn about your rights, <a href={gdpr}>click me!</a> For further information regarding our usage of your data, contact us at data@stillsite.net
                    <br /><br />
                    <span className={styles["cookie-modal__right"]}>
                        We are not the cookie monster! Your cookies are yours!
                        <br />
                        Still Site Limited</span>

                </p>
                <footer className={styles["cookie-modal__footer"]}>
                    <button className={styles["cookie-modal__button"]} onClick={() => accepted(false)}>Essential Cookies</button>
                    <button className={styles["cookie-modal__button"]} onClick={() => accepted(true)}>All Cookies</button>
                </footer>
            </div>
        </Modal>
    )
}

export default CookieModal