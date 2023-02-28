import { AnimatePresence, Variants } from 'framer-motion'
import React, { ReactNode, useId } from 'react'

import { motion } from 'framer-motion'

import styles from './ribbon.module.scss'

import { v4 as uuid } from 'uuid';


type Props = {
  text: string,
  show?:boolean,
  callback?:()=>void
}

const variants: (delay: number) => Variants = (delay: number) =>
{
  return {
    init: {
      // transform: "translate(100%, -50%)"
      translateX: "100%",
      translateY: "-50%",
      skewY: "-10deg"
    },
    initLeft: {
      translateX: "-100%",
      translateY: "-100%",
      skewY: "20deg"
    },
    animate: {
      translateX: 0,
      translateY: 0,
      transition: {
        delay: delay,
        duration: .5,

        type: {
          type: "tween",
          ease: "circInOut",

        },
      }
    },
    exit: {
      translateX: "-100%",
      translateY: "50%",
      transition: {
        delay: delay,
        duration: .25,

        type: {
          type: "tween",
          ease: "circInOut",
        }
      },

    },
    exitLeft: {
      translateX: "100%",
      translateY: "100%",
      transition: {
        delay: delay,
        duration: .25,
        type: {
          type: "tween",
          ease: "circInOut",
        }
      },
    }
  }
}

function Ribbon({ text, show = true, callback = ()=>{}}: Props)
{

  let delay = 0

  let elements: ReactNode[] = []
  let split = text.split(" ");

  for (let index = 0; index < split.length; index++)
  {
    const element = split[index];
    elements.push(
      <motion.span key={uuid()} className={styles["ribbon__segment"]}
        variants={variants(delay)}
        initial="init" animate="animate" exit={"exit"}
      >
        {element}
      </motion.span>
    )
    if (index !== split.length - 1)
      elements.push(
        <motion.span key={uuid()} className={styles["ribbon__empty"]}
          variants={variants(delay + 0.5)}
          initial="initLeft" animate="animate" exit={"exitLeft"}
        />
      )
    delay++;
  }

  return (
    <div className={styles["ribbon"]}>
      <AnimatePresence onExitComplete={callback}>
        {
          show &&
          elements
        }
      </AnimatePresence>
    </div>
  )
}


export default Ribbon