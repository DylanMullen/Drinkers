import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react'

import styles from './backdrop.module.scss'

type Props = {
  children: React.ReactNode,
  closeCallback?: Function
}


function Backdrop({ children, closeCallback = () => { } }: Props)
{
  const [time] = useState(new Date().getTime())

  const keyPress = useCallback((e: KeyboardEvent) =>
  {
    if (e.code === "Escape")
      closeCallback(undefined);
  }, [closeCallback])

  useEffect(() =>
  {
    document.addEventListener("keydown", keyPress);

    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress])

  const click = () =>
  {
    if(new Date().getTime() - time >= 750)
      closeCallback()
  }

  return (
    <motion.div
      key={"backdrop"}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,.65)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={{
        type: "spring",
        duration: .5,
        delayChildren: 5
      }}
      onClick={click}
      className={styles["backdrop"]}>
      {children}
    </motion.div>
  )
}

export default Backdrop