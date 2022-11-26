import React from 'react'
import { m , Variants } from 'framer-motion';

import styles from './modal.module.scss';

import { BsShieldExclamation as WarningIcon } from 'react-icons/bs'
import { IoMdClose as CloseIcon } from 'react-icons/io'

export type ModalProps = {
  children?: React.ReactNode,
  icon?: React.ReactNode,
  horizontal?: boolean,
  closeBtn?: boolean,
  closeClbck?: Function,
  customColors?: ModalCustomScheme,
  title?: string
}

export type ModalCustomScheme = {
  accent: string,
  icon: string,
  text: string,
}

const animation: Variants = {
  hidden: {
    y: "5vh",
    opacity: 0,
  },
  shown: {
    y: "0",
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  },
  exit: {
    y: "100vh",
    opacity: 0
  }
}


function Modal({ icon, horizontal = false, closeClbck, closeBtn, children, customColors, title = "" }: ModalProps)
{

  const close = (e: React.MouseEvent | undefined) => { if (closeClbck !== undefined) closeClbck(e) }

  const customExists = customColors !== undefined;

  return (
      <m.div
        key={"modal"}
        variants={animation}
        initial={"hidden"}
        animate={"shown"}
        exit={"exit"}
        className={styles["modal"] + " " + (horizontal ? styles["modal--horizontal"] : "")}
        style={customExists ? { background: customColors.accent } : undefined}
        onClick={e => e.stopPropagation()}

      >
        <header className={styles["modal__header"]}
        >
          <div className={styles["modal__header__body"]}>
            <div className={styles["modal__header__icon"]}
              style={customExists ? { background: customColors.icon, color: customColors.text } : undefined}>
              {icon !== undefined ? icon : <WarningIcon />}
            </div>
            {
              horizontal &&
              <h1 className={styles["modal__header__title"]}
                style={customExists ? { background: customColors.icon } : undefined}
              >{title}</h1>
            }

          </div>
          {
            closeBtn &&
            <button className={styles["modal__close"]} onClick={close}><CloseIcon /></button>
          }
        </header>
        <section className={styles["modal__body"]}>
          {children}

        </section>
        <footer className={styles["modal__footer"]} style={customExists ? { background: customColors.accent } : undefined} />
      </m.div>
  )
}

export default Modal