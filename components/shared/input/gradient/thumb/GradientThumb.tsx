import React, { forwardRef, Ref, RefObject, useEffect, useState } from 'react'

import { motion, PanInfo, useMotionValue } from 'framer-motion'

import styles from '../gradient-input.module.scss';
import { GradientPosition } from '../slider/GradientSlider';

type Props = {
    gradient: GradientPosition,
    width: number,
    callback: (uuid: string, x: number, width: number) => void
}


function GradientThumb({ gradient: { colour, uuid, percentage }, width, callback }: Props)
{
    const x = useMotionValue((percentage / 100) * width);

    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
    const onDrag = (_: PointerEvent, info: PanInfo) =>
    {
        callback(uuid, clamp(x.get(), -width, width) / width * 100, width)
        x.set(clamp(x.get(), -width, width))
    }

    useEffect(() =>
    {
        x.set((percentage / 100) * width)
    }, [width])

    return (
        <motion.div
            className={styles["gradient-thumb"]}
            style={{ x: x, translateX: "-50%" }}
            drag={"x"} onDrag={onDrag}
            dragMomentum={false} dragConstraints={{ left: 0, right: width }} dragElastic={false}
            onClick={e => e.stopPropagation()}
        >
            <div
                className={styles["gradient-thumb__inner"]}
                style={{ backgroundColor: colour }}
            />
        </motion.div>
    )
}

export default GradientThumb