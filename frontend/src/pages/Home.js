import MusicCard from "../components/MusicCard";
import React, {useEffect} from "react";
import {message, Skeleton} from "antd";

const Home = ({getUserInfo, loadCookie, base_url, ml_url, api_key}) => {
    const [items, setItems] = React.useState(null)

    useEffect(() => {
        const get_recommend = async () => {
            if (items != null || ! loadCookie) return;

            const userInfo = getUserInfo()

            let request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            try {
                let data = []

                if (userInfo != null) {
                    let response = await (fetch(base_url + `/get-history?user_id=${userInfo["user_id"]}`, request))
                    data = await (response.json())

                    if (!response.ok) {
                        console.log("Error", data["error-message"])
                        return;
                    }

                    data = await data["data"].map(item => item["track_id"])
                }

                request = {
                    method: "POST",
                    headers: {
                        "x-api-key": api_key
                    },
                    body: JSON.stringify({
                        "history": data
                    })
                }

                let response = await (fetch(ml_url + `/recommend`, request))
                data = await (response.json())

                if (!response.ok) {
                    console.log("Error", data["error-message"])
                    return;
                }

                request = {
                    method: "GET",
                    headers: {
                        "x-api-key": api_key
                    }
                }

                response = await (fetch(base_url + `/get-songs?track_id=${data["recommend"]}`, request))
                const songs = await (response.json())

                if (response.ok) {
                    setItems(songs["data"])
                } else {
                    console.log("Error", data["error-message"])
                }
            } catch (e) {
                console.log("Failed request: ", e)
            }
        }

        get_recommend().catch(console.error)
    });

    const addHistory = async (track_id) => {
        if (getUserInfo() == null) return;

        const user_id = getUserInfo()["user_id"]

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
                console.log("Error", data["error-message"])
            }
        } catch (e) {
            console.log("Failed request: ", e)
        }
    }

    return React.useMemo(() => (
        <div>
            {items == null? <Skeleton active/>: items.map(prop => <MusicCard key={"MusicCard" + prop["id"]} {...prop} addHistory = {addHistory}/>)}
        </div>
        ), [items, addHistory]
    )
}

export default React.memo(Home);