import PanelButton from 'components/admin/panel-button'
import Head from 'next/head'
import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { AiFillProject }  from 'react-icons/ai'
import { CgFileDocument } from 'react-icons/cg'

import styles from 'styles/pages/admin/home.module.scss'

type Props = {
}

function Admin({ }: Props)
{
  return (
    <>
      <Head>
        <title>Admin | Drinkers</title>

      </Head>
      <header className={styles["admin__header"]}>
        <div className={styles["admin__buttons"]}>
          <PanelButton text='Projects' icon={<AiFillProject />} />
          <PanelButton text='Users' icon={<FaUsers />} />
          <PanelButton text='Changelogs' icon={<CgFileDocument />} />
        </div>
      </header>

      <main className={styles["admin"]}>

      </main>

      <footer className={styles["admin-footer"]}>

      </footer>
    </>
  )
}

export default Admin