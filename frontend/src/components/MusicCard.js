import React from 'react';
import {Card, Flex, Button} from 'antd';
import {CloseOutlined} from "@ant-design/icons";

const {Meta} = Card;
const MusicCard = (props) => {
    const {addHistory, deleteHistory, track_id, song, singer, album, track_genre, url} = props

    const clickEvent = async () => {
        addHistory(track_id)

        window.open(
            `https://open.spotify.com/track/${track_id}`,
            "_blank"
        )
    }

    return (
        <Flex align = "center">
            <div onClick = {() => clickEvent()}>
                <Card
                    hoverable
                    style = {{
                        width: (deleteHistory ? "67vw" : "70vw"),
                        margin: "20px",
                        textAlign: "center",
                        paddingRight: "20vh"
                    }}
                >
                    <Meta
                        title = {song}
                        description = {
                        <div>
                            <p> Artists: {singer.replaceAll(";", ", ")} </p>
                            <p> Album: {album} </p>
                            <p> Genre: {track_genre} </p>
                        </div>}

                        avatar = {<img style = {{height: "140px", width: "140px", borderRadius: "5%"}} alt = "sample"
                                       src = {url? url: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg"}/>}/>
                </Card>
            </div>
            {
                deleteHistory ?
                    (<Button
                        onClick = {() => deleteHistory(track_id)}
                        icon = {<CloseOutlined/>}
                        shape = "circle"
                    />) : (<div/>)
            }
        </Flex>
    );
}
export default MusicCard;