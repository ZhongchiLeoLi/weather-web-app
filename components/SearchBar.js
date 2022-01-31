import React, {useState, useEffect} from 'react';
import cities from "../public/cities.json"
import { useDebounce } from "use-debounce";
import Link from "next/link";
import styles from '../styles/SearchBar.module.css'
import Router from 'next/router';



export default function SearchBar({placeholder = "Search for your city ..."}) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);

  // deboucing the search query to avoid sending too many search requests in a short period of time
  const [query] = useDebounce(value, 50);
  
  // the minimum length of the query string before a search is performed,
  // increase this number to avoid perfoming ambiguous searches when our city db is huge
  let queryLengthThreshhold = 0;  

  useEffect(() => {
    let searchResults = []
    
    if(query.length > queryLengthThreshhold) {
      for(let city of cities) {
        // returning first 8 searched cities
        if(searchResults.length > 8) break;

        if(city.name.toLowerCase().startsWith(query.toLowerCase())) {
          // adding the slug field to each city 
          // (adding the id field in the end since there may be duplicate city names)
          let slug = city.name.toLowerCase().replace(" ", "-") + "-" + city.id;
          searchResults.push({...city, slug});
        }
      }
    }

    setResults(searchResults);
    console.log(results);
  }, [query]);

  useEffect(() => {
    const cleanQuery = () => setValue("");
    Router.events.on("routeChangeComplete", cleanQuery);

    return () => {Router.events.off("routeChangeComplete", cleanQuery)};
  }, [])

  return (
    <div className={styles.wrapper}>
      <input 
        className={styles.searchInput}
        type="text" 
        name="" 
        id="" 
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => setValue(value)}
      />
      {query.length > queryLengthThreshhold && (
        <ul className={styles.resultsList}>
          {results.length 
            ? (results.map((result, index) => ( 
                <li key={result.slug} className={styles.resultsItem}>
                  <Link href={`/city/${result.slug}`}>
                    <a className={styles.resultsLink}>{result.name}</a>
                  </Link>
                </li> 
              )))
            : <li>No results found</li>}
        </ul>)}
    </div>
  );
}
