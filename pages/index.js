import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import SearchBar from '../components/SearchBar'
import home from "../public/home.png"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Weather Web App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.leftCol}>
        <h1>Weathery</h1>
        <h3>Let's talk about the weather</h3>
        <SearchBar />
      </div>

      <div className={styles.rightCol}>
        <div className={styles.imgWrapper}>
          <Image src={home}/>
        </div>
      </div>
    </div>
  )
}
