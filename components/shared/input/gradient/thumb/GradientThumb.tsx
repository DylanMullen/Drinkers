import React, { forwardRef, Ref, RefObject, useEffect, useState } from 'react'

import { motion, PanInfo, useMotionValue } from 'framer-motion'

import styles from '../gradient-input.module.scss';
import { GradientPosition } from '../slider/GradientSlider';
import useGradientContext from 'context/GradientContext';
import { FiTrash2 } from 'react-icons/fi';

type Props = {
    gradient: GradientPosition,
    width: number,
    selected:boolean,
    callback: (uuid: string, x: number, width: number) => void,
    onClick?: (uuid: string) => void
}


function GradientThumb({ gradient: { colour, uuid, percentage}, selected, width, callback, onClick = () => { } }: Props)
{
    const x = useMotionValue((percentage / 100) * width);
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
    const onDrag = () =>
    {
        callback(uuid, clamp(x.get(), -width, width) / width * 100, width)
        x.set(clamp(x.get(), -width, width))
    }

    useEffect(() =>
    {
        x.set((percentage / 100) * width)
    }, [width])

    const click = (e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation();
        onClick(uuid)
    }

    return (
        <motion.div
            className={`${styles["gradient-thumb"]} ${selected === true ? styles["gradient-thumb--selected"] : ""}`}
            style={{ x: x, translateX: "-50%" }}
            drag={"x"} onDrag={onDrag} onDragEnd={()=>onClick(uuid)}
            dragMomentum={false} dragConstraints={{ left: 0, right: width }} dragElastic={false}
            onClick={click}
        >
            <div
                className={styles["gradient-thumb__inner"]}
                style={{ backgroundColor: colour }}
            />
            {/* <button className={styles["gradient-thumb__delete"]}><FiTrash2 /></button> */}
        </motion.div>
    )
}

export default GradientThumb