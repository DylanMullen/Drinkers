import { motion, useAnimation, Variants } from 'framer-motion'
import React, { PropsWithChildren, useEffect } from 'react'
import { AiOutlineQuestion } from 'react-icons/ai'
import { BsBinoculars, BsPatchQuestion } from 'react-icons/bs'
import { IoBeer, IoBeerOutline } from 'react-icons/io5'
import { useInView } from 'react-intersection-observer'
import Section from '../section'

import styles from './about-us.module.scss'

type Props = PropsWithChildren & {
  right?: boolean
}

function JoinUs()
{
  return (
    <Section id='' title='About Us'
      scheme={{
        background: "white",
        transformY: "150px",
        titleColor: "black"
      }}
    >
      <div className={styles["about-us"]}>
        <SectionWrapper>
          <div className={styles["about-us__section__icon"]}>
            <BsBinoculars style={{ padding: "1rem" }} />
          </div>
          <div className={styles["about-us__section__content"]}>
            <h1 className={styles["about-us__section__title"]}>Who?</h1>
            <p className={`${styles["about-us__section__text"]}`}>
              Here at Drinkers, we are led by a 4 man team to bring you the best drinking games we offer on the market. Whether you want to play virtually or in person, we have the games for you! LIke you, we love a good drink, so why should it be boring?
            </p>
          </div>
        </SectionWrapper>
        <SectionWrapper right>
          <div className={styles["about-us__section__icon"]}>
            <AiOutlineQuestion />
          </div>
          <div className={styles["about-us__section__content"]}>
            <h1 className={styles["about-us__section__title"]}>Why?</h1>
            <p className={`${styles["about-us__section__text"]}`}>
              After one of our personal online drinking games went down, we needed a solution to our lockdown woes. We saw a gap during lockdown 2021 to create virtual drinking games and we took it.
            </p>
          </div>
        </SectionWrapper>
        <SectionWrapper>
          <div className={styles["about-us__section__icon"]}>
            <IoBeerOutline />
          </div>
          <div className={styles["about-us__section__content"]}>
            <h1 className={styles["about-us__section__title"]}>How?</h1>
            <p className={`${styles["about-us__section__text"]}`}>
              Drinkers is backed by you! Your enthusiasm and enjoyment keeps us online!
            </p>
          </div>
        </SectionWrapper>

      </div>
    </Section>
  )
}

const variants: Variants = {
  "init": {
    transform: "translateX(-100%)",
    opacity: 0
  },
  "init--right": {
    transform: "translateX(100%)",
    opacity: 0
  },
  "visible": {
    transform: "translateX(0%)",
    opacity: 1,
    transition: {
      delay: .25,
      duration: .5
      // type: "tween",
      // ease: "easeInOut"
    }
  }
}

function SectionWrapper({ right = false, children }: Props)
{
  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() =>
  {
    if (inView)
      control.start("visible");
    else
      control.start(right ? "init--right" : "init")
  }, [control, inView]);


  return (
    <motion.section
      ref={ref}
      className={`${styles["about-us__section"]} ${right ? styles["about-us__section--right"] : ""}`}
      variants={variants}
      initial={right ? "init--right" : "init"}
      animate={control}
    >
      {children}
    </motion.section>
  )
}

export default JoinUs