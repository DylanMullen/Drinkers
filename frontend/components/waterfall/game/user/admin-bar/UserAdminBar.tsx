import React from 'react'

import styles from './admin-bar.module.scss';

type Props = {
    uuid: string

}

type AdminProps = {
    icon: string,
    tooltip: string,
    callback: React.MouseEventHandler<HTMLButtonElement>,
    modifier: string
}

function UserAdminBar({ uuid }: Props)
{
    return (
        <ul className={styles["useradmin"]}>
            <AdminButton icon="🚫" tooltip="Ban User" callback={(e:React.MouseEvent<HTMLButtonElement>)=>{}} modifier="ban" />
            <AdminButton icon="🍺" tooltip="Make Next User" callback={(e:React.MouseEvent<HTMLButtonElement>)=>{}} modifier="next" />
        </ul>
    )
}

function AdminButton({ icon, tooltip, callback, modifier }: AdminProps)
{
    return (
        <li className={styles["useradmin__button"] + " " + styles["useradmin__button--" + modifier]}>
            <button className={styles["useradmin__button__input"]} onClick={callback}>{icon}</button>
            {/* <span className={styles["useradmin__tooltip"]}>{tooltip}</span> */}
        </li>
    )
}


export default UserAdminBar