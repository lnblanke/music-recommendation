import MusicCard from "../components/MusicCard";
import React, {useEffect} from "react";
import {message, Skeleton, Empty} from "antd";

const History = ({userInfo, base_url, api_key}) => {
    const [items, setItems] = React.useState(null)

    const get_history = async (force = false) => {
        if ((! force && items != null )|| userInfo == null) return;

        let request = {
            method: "GET",
            headers: {
                "x-api-key": api_key
            }
        }

        try {
            let response = await (fetch(base_url + `/get-history?user_id=${userInfo["user_id"]}`, request))
            let data = await (response.json())

            if (!response.ok) {
                message.error(`Error: ${data["error-message"]}`)
                return;
            }

            data = await data["data"].map(item => item["track_id"])

            if (!data.length) {
                setItems([])
                return
            }

            request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            response = await (fetch(base_url + `/get-songs?track_id=${data}`, request))
            const songs = await (response.json())

            if (response.ok) {
                setItems(songs["data"])
            } else {
                message.error(`Error: ${data["error-message"]}`)
            }
        } catch (e) {
        }
    }

    useEffect(() => {
        get_history().catch(console.error)
    });

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

            if (!response.ok) {
                message.error("Add history failed!")
            } else {
                await get_history(true)
            }
        } catch (e) {
        }
    }

    const deleteHistory = async (track_id) => {
        if (userInfo == null) return;

        const user_id = userInfo["user_id"]

        const request = {
            method: "DELETE",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                user_id: user_id,
                track_id: track_id
            })
        }

        try {
            const response = await (fetch(base_url + `/delete-history`, request))

            if (!response.ok) {
                message.error("Delete history failed!")
            } else {
                await get_history(true)
            }
        } catch (e) {
        }
    }

    return React.useMemo(() => (
            <div>
                {items == null ? <Skeleton active/> :
                    items.length ? items.map(
                        prop => <MusicCard
                            key = {"MusicCard" + prop["id"]}
                            {...prop}
                            addHistory = {addHistory}
                            deleteHistory = {deleteHistory}
                        />
                    ) : <Empty/>
                }
            </div>
        ), [items, addHistory, deleteHistory]
    )
}

export default History;