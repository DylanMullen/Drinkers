import React from 'react'

import styles from './input-group.module.scss'

type Props = {
    columns?: number
    children?: React.ReactNode,
}

function InputGroup({ columns = 1, children }: Props)
{

    let clazz = styles["input-group"] + " " + styles["input-group--" + columns]
    return (
        <div className={clazz}>
            {children}
        </div>
    )
}

export default InputGroup