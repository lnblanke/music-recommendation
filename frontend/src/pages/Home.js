import MusicCard from "../components/MusicCard";
import React, {useCallback, useEffect} from "react";
import {Button, FloatButton, message, Skeleton} from "antd";
import {ArrowUpOutlined, ReloadOutlined} from "@ant-design/icons";

const Home = ({getUserInfo, loadCookie, genre, base_url, ml_url, api_key}) => {
    const [items, setItems] = React.useState(null)
    const [reload, setReload] = React.useState(false)

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "smooth"
        })

        const get_recommend = async () => {
            if (! loadCookie) return;

            setItems(null)
            setReload(false)

            try {
                let ids;
                if (genre == null) {
                    let data = []
                    const userInfo = getUserInfo()

                    let request = {
                        method: "GET",
                        headers: {
                            "x-api-key": api_key
                        }
                    }

                    if (userInfo != null) {
                        let response = await (fetch(base_url + `/get-history?user_id=${userInfo["user_id"]}`, request))
                        data = await (response.json())

                        if (!response.ok) {
                            message.error(`Error: ${data["error-message"]}`)
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
                        message.error(`Error: ${data["error-message"]}`)
                        return;
                    }

                    ids = data["recommend"]
                } else {
                    const request = {
                        method: "GET",
                        headers: {
                            "x-api-key": api_key
                        }
                    }

                    const response = await (fetch(base_url + `/get-songs-by-genre?genre=${genre}`, request))
                    const data = await (response.json())

                    ids = data["data"]
                }

                const request = {
                    method: "GET",
                    headers: {
                        "x-api-key": api_key
                    }
                }

                const response = await (fetch(base_url + `/get-songs?track_id=${ids}`, request))
                const songs = await (response.json())

                if (response.ok) {
                    setItems(songs["data"])
                } else {
                    message.error(`Error: ${songs["error-message"]}`)
                }
            } catch (e) {
            }
        }

        get_recommend().catch(console.error)
    }, [genre, base_url, api_key, getUserInfo, loadCookie, ml_url, reload]);

    const addHistory = useCallback(async (track_id) => {
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

            if (! response.ok) {
                message.error("Add history failed!")
            }
        } catch (e) {
        }
    }, [getUserInfo, base_url, api_key])

    return React.useMemo(() => (
        <div style={{textAlign: "right"}}>
            <Button style = {{marginLeft: "20px", marginRight: "30px"}} onClick = {() => setReload(true)}>
                <ReloadOutlined/>
                Reload
            </Button>
            {items == null? <Skeleton active/>: items.map(prop => <MusicCard key={"MusicCard" + prop["id"]} {...prop} addHistory = {addHistory}/>)}
            <FloatButton
                icon = {<ArrowUpOutlined/>}
                onClick = {() => window.scroll({top: 0, behavior: "smooth"})}
            />
        </div>
        ), [items, addHistory]
    )
}

export default React.memo(Home);