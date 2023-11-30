import React, {useCallback, useEffect, useMemo} from 'react';
import {Empty, FloatButton, message, Skeleton} from 'antd';
import MusicCard from "../components/MusicCard";
import {ArrowUpOutlined} from "@ant-design/icons";

const Search = (props) => {
    const {prompt, setPrompt, searched, setSearched, userInfo, base_url, api_key} = props
    const [item, setItem] = React.useState(null)

    const search = useCallback(async () => {
        if (prompt == null || searched) return

        setItem(null)
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
    }, [prompt, searched, base_url, api_key, setSearched, setPrompt])

    useEffect(() => {
        search().catch(console.error)

        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    }, [prompt, search]);

    const addHistory = useCallback(async (track_id) => {
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
    }, [userInfo, base_url, api_key])

    return useMemo(() => (
        prompt === null || prompt.length === 0 ? (<Empty/>) :
            (
                <div style = {{textAlign: "center"}}>
                    <h2 style = {{textAlign: "left", padding: "20px"}}> Result of {prompt} </h2>
                    {item === null ? <Skeleton active/> : item.map(prop => <MusicCard
                        key = {"MusicCard" + prop["id"]} {...prop} addHistory = {addHistory}/>)}

                    <FloatButton
                        icon = {<ArrowUpOutlined/>}
                        onClick = {() => window.scroll({top: 0, behavior: "smooth"})}
                    />
                </div>
            )
    ), [prompt, item, addHistory]);
}
export default Search;