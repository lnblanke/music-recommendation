import React from 'react';
import {LoadingOutlined} from '@ant-design/icons';
import {Empty, message, Spin} from 'antd';
import MusicCard from "../components/MusicCard";

const genre = [
    'blues',
    'classical',
    'country',
    'disco',
    'hiphop',
    'jazz',
    'metal',
    'pop',
    'reggae',
    'rock',
]

const Analyze = (props) => {
    const {uploadTS, setUploadTS, analyzed, setAnalyzed, ml_url, api_key} = props
    const [content, setContent] = React.useState(null)
    const [related, setRelated] = React.useState([{
        id: 0,
        song: "Sample song 0",
        singer: "Sample singer 0",
        album: "Sample album 0"
    }])

    const remove_file = async() => {
        const request = {
            method: "DELETE",
            headers: {
                "x-api-key": api_key
            }
        }

        try {
            await (fetch(`https://xpu7xvvdcg.execute-api.us-east-2.amazonaws.com/dev/aws-music-upload/${uploadTS}.mp3`, request))
        } catch (e) {
            console.log("Failed request: ", e)
        }
    }

    console.log(analyzed, uploadTS, content)

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
                await remove_file()

                setContent(data["outputs"])
            } else {
                message.error("Internal error. The service is unable the analyze the file")
                console.log(data)
                await remove_file()
                setUploadTS(null)
                setContent(null)
            }
        } catch (e) {
            message.error("API call timeout. Please try again")
            console.log("Failed request: ", e)
            await remove_file()
            setUploadTS(null)
            setContent(null)
        }
        setAnalyzed(true)
    }

    analyze()

    return (
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
                        <h1 style = {{padding: "20px"}}> {content === null? content: genre[content].toUpperCase()} </h1>
                        <h2 style={{textAlign: "left", padding: "20px"}}> Similar songs </h2>
                        {related.map(prop => <MusicCard key={"MusicCard" + prop["id"]} {...prop}/>)}
                    </div>
                )
            )
    );
}
export default Analyze;