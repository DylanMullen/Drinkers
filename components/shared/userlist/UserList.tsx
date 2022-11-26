import React from 'react'
import { User } from 'utils/UserUtil'
import UserCard from '../usercard'

import styles from './userlist.module.scss'

type Props = {

    users: React.ReactNode[]

}

function UserList({ users }: Props)
{
    return (
        <div data-users={users.length > 4 ? 4 : users.length} className={styles["userlist"]}>
            <ul className={styles["userlist__list"]}>
                {users}
            </ul>
        </div>
    )
}

export default UserList