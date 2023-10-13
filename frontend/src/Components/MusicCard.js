import React from 'react';
import {Card} from 'antd';

const {Meta} = Card;
const MusicCard = (props) => {
    const {id, song, singer, album} = props
    console.log(id + " " + song + " " + singer)
    return (
        <Card
            hoverable
            style = {{
                width: "70vw",
                margin: "20px"
            }}
            key = {id}
        >
            <Meta
                title = {song}
                description = {<div><span> {singer} </span> <br/> <span> {album} </span></div>}

                avatar = {<img style = {{height: "70px"}} alt = "sample"
                               src = "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg"/>}/>
        </Card>
    );
}
export default MusicCard;