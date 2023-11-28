import React from "react";
import ReactWordcloud from "react-wordcloud";
import {useNavigate} from "react-router-dom";

const MusicPreferenceWordCloud = (props) => {
    const {preferences, setGenre} = props
    const navigate = useNavigate()

    return (
        preferences ?
            (<div>
                <h2> Music Preference </h2>
                <ReactWordcloud
                    words = {preferences}
                    options = {{fontFamily: "Righteous", fontSizes: [20, 50], rotations: 0, enableTooltip: false}}
                    callbacks = {{
                        onWordClick: e => {
                            setGenre(e["text"])
                            navigate("/home")
                        }
                    }}
                />
            </div>) : <div/>
    );
};

export default MusicPreferenceWordCloud;