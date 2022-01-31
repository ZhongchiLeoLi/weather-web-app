import React from 'react';
import cities from "../../public/cities.json"
import styles from '../../styles/City.module.css'
import Image from 'next/image'
import SearchBar from '../../components/SearchBar';
import Link from 'next/link';

// importing weather illustrations:
import fewClouds from "../../public/few_clouds.png"
import clouds from "../../public/clouds.png"
import other from "../../public/other.png"
import thunder from "../../public/thunder.png"
import rain from "../../public/rain.png"
import snow from "../../public/snow.png"
import drizzle from "../../public/drizzle.png"
import clear from "../../public/clear.png"

export async function getServerSideProps({ params }) {
  const slug = params.city.split(["-"]);
  const id = slug[slug.length - 1];
  const city = cities.find(city => city.id === id);
  
  if(!city || slug.slice(0, slug.length - 1).join(' ') !== city.name.toLowerCase()) {
    return {
      notFound: true,
    }
  }

  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
  const data = await res.json();

  if(!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      weather: data,
    },
  };
}

export default function City({ weather }) {
  const {temp, feels_like, temp_min, temp_max, humidity} = weather.main;
  const mainWeather = weather.weather[0].main;
  const curWeather = weather.weather[0].description;
  const city = weather.name + ", " + weather.sys.country;
  const wind = weather.wind.speed;

  let img = other; // for displaying different illustrations based on weather
  let background = "clouds"; // for displaying different backgrounds based on weather
  if(mainWeather  === "Clear") {
    background = "clear";
    img = clear;
  } 
  else if(mainWeather  === "Thunderstorm" || mainWeather  === "Rain" || mainWeather  === "Clouds" && curWeather.startsWith("overcast")) {
    background = "dim";
    if(mainWeather  === "Thunderstorm") img = thunder;
    else if(mainWeather  === "Rain") img = rain;
    else img = clouds;
  } 
  else if(mainWeather  === "Drizzle") img = drizzle;
  else if(mainWeather  === "Snow") img = snow;
  else if(mainWeather  === "Clouds") img = fewClouds;

  return (
    <div className={`${styles[background]} ${styles.wrapper}`}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link className={styles.buttonWrapper} href="/">
            <a className={styles.backButton}>◄ Back to home</a>
          </Link>
          <div className={styles.searchWrapper}>
            <SearchBar placeholder="Search for another city ..." />
          </div>
        </div>
        <div className={styles.cols}>
          <div className={styles.leftCol}>
            <h1 className={styles.city}>{city}</h1>
            <div className={styles.temps}>
              <div className={styles.realFeel}>
                <p className={styles.temp}>{temp}°C</p>
              </div>
              <div className={styles.lowHigh}>
                <p>Max: {temp_max}°C</p>
                <p>Min: {temp_min}°C</p>
              </div>
            </div>
            <p>Feels like {feels_like}°C</p>
            <div className={styles.otherInfo}>
              <p>Humidity: {humidity}%</p>
              <p>Wind: {wind}km/h</p>
            </div>
          </div>
          <div className={styles.rightCol}>
            <p>{curWeather}</p>
            <div className={styles.weatherImg}>
              <Image 
                layout="responsive"
                src={img}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
