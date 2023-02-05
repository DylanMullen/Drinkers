import React from 'react'

import styles from './section.module.scss'

type Props = React.PropsWithChildren & {
  title: string
  id: string
  scheme: Scheme
}

type Scheme = {
  showTitle?: boolean
  background?: string,
  transformY?: string,
  titleColor?:string
}

function HomeSection({ title, id, scheme: { showTitle, titleColor = "white", background, transformY } = { showTitle: true }, children }: Props)
{
  return (
    <section id={id} className={styles["home-section"]} style={{background: background, marginTop: `-${transformY}`, paddingTop: `${transformY}`}}>
      <h1 className={`${styles["home-section__title"]} ${(!showTitle ? styles["home-section__title--hidden"] : "")}`} style={{color:titleColor}}>{title}</h1>
      <div className={styles["home-section__content"]}>
        {children}
      </div>
    </section>
  )
}

export default HomeSection