import {useState, useEffect} from "react"

export function App() {
    const [message, setMessage] = useState("Loading")

    useEffect( () => { //useEffect is used for external activities like fetching api

        async function fetchData() {
        try {
           const response = await fetch('http://localhost:4000/api/testing')

           const data = await response.json()
           setMessage(data.message)
           console.log("success")
        } catch(err) {
            console.log(err)
        }
    }
        fetchData();
    }, [])

    return (
        <>
        <h1>Web Scrapper</h1>
        <p>{message}</p>
        </>
        
    )
}

