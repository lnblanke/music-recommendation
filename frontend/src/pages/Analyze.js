import React, {useCallback, useEffect, useMemo} from 'react';
import {LoadingOutlined} from '@ant-design/icons';
import {Empty, message, Spin} from 'antd';
import MusicCard from "../components/MusicCard";

const Analyze = (props) => {
    const {getUserInfo, uploadTS, setUploadTS, analyzed, setAnalyzed, ml_url, base_url, api_key} = props
    const [content, setContent] = React.useState(null)
    const [related, setRelated] = React.useState(null)

    const remove_file = async () => {
        const request = {
            method: "DELETE",
            headers: {
                "x-api-key": api_key
            }
        }

        try {
            await (fetch(`https://xpu7xvvdcg.execute-api.us-east-2.amazonaws.com/dev/aws-music-upload/${uploadTS}.mp3`, request))
        } catch (e) {
        }
    }

    const analyze = async () => {
        if (uploadTS === null || analyzed) return

        const request = {
            method: "POST",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                "name": `${uploadTS}`
            })
        }

        try {
            const response = await (fetch(ml_url + `/analyze`, request))
            const data = await (response.json())

            if (response.ok) {
                await setAnalyzed(true)
                await remove_file()

                return data
            } else {
                message.error("Internal error. We are unable to analyze the audio file")
            }
        } catch (e) {
            message.error("API call timeout. Please try again")
        }

        await remove_file()
        await setUploadTS(null)
        setContent(null)
        setRelated(null)
    }

    useEffect(() => {
        analyze().then(async data => {
            if (data === undefined) return;

            await setContent(data["genre"].toUpperCase())

            const request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            try {
                const response = await (fetch(base_url + `/get-songs?track_id=${data["similar"]}`, request))
                const songs = await (response.json())

                if (response.ok) {
                    await setRelated(songs["data"])
                } else {
                    message.error(`Error: ${data["error-message"]}`)
                    setRelated(null)
                }
            } catch (e) {
                setRelated(null)
            }
        })

        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    });

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

    return useMemo(() => (
        uploadTS === null ? (<Empty/>) :
            (! analyzed? (
                    <div style = {{textAlign: "center", margin: "50px"}}>
                        <Spin
                            indicator = {
                                <LoadingOutlined
                                    style = {{
                                        fontSize: 100
                                    }}
                                />
                            }
                        />
                        <h1 style = {{padding: "20px"}}> Analyzing audio data ... </h1>
                    </div>
                ) : (
                    <div style = {{textAlign: "center"}}>
                        <h2 style = {{padding: "20px"}}> The genre of the song </h2>
                        <h1 style = {{padding: "20px"}}> {content} </h1>
                        <h2 style = {{textAlign: "left", padding: "20px"}}> Similar songs </h2>
                        {related === null ? related : related.map(prop => <MusicCard
                            key = {"MusicCard" + prop["id"]} {...prop} addHistory = {addHistory}/>)}
                    </div>
                )
            )
    ), [uploadTS, analyzed, content, related, addHistory]);
}
export default Analyze;