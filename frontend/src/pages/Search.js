import React, {useEffect, useMemo} from 'react';
import {Empty, message} from 'antd';
import MusicCard from "../components/MusicCard";

const Search = (props) => {
    const {prompt, setPrompt, searched, setSearched, userInfo, base_url, api_key} = props
    const [item, setItem] = React.useState(null)

    const search = async () => {
        if (prompt == null || searched) return

        setSearched(true)

        const request = {
            method: "GET",
            headers: {
                "x-api-key": api_key
            }
        }

        try {
            const response = await (fetch(base_url + `/search?prompt=${prompt}`, request))
            const data = await (response.json())

            if (response.ok) {
                await setItem(data["data"])
                return
            } else {
                message.error(`Error: ${data["error-message"]}`)
            }
        } catch (e) {
        }

        await setPrompt(false)
    }

    useEffect(() => {
        search().catch(console.error)
    }, [prompt, search]);

    const addHistory = async (track_id) => {
        if (userInfo == null) return;

        const user_id = userInfo["user_id"]

        const request = {
            method: "POST",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                user_id: user_id,
                track_id: track_id,
                ts: new Date().getTime()
            })
        }

        try {
            const response = await (fetch(base_url + `/add-history`, request))
            const data = await (response.json())

            if (! response.ok) {
                message.error("Add history failed!")
                message.error(`Error: ${data["error-message"]}`)
            }
        } catch (e) {
        }
    }

    return useMemo(() => (
        prompt === null || prompt.length === 0 ? (<Empty/>) :
            (
                <div style = {{textAlign: "center"}}>
                    <h2 style = {{textAlign: "left", padding: "20px"}}> Result of {prompt} </h2>
                    {item === null ? item : item.map(prop => <MusicCard
                        key = {"MusicCard" + prop["id"]} {...prop} addHistory = {addHistory}/>)}
                </div>
            )
    ), [prompt, item, addHistory]);
}
export default Search;