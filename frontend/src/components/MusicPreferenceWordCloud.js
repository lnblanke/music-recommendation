import React from "react";
import ReactWordcloud from "react-wordcloud";

const MusicPreferenceWordCloud = (props) => {
    const {preferences} = props

    return (
        preferences ?
            (<div>
                <h2> Music Preference </h2>
                <ReactWordcloud words = {preferences}
                                options = {{fontFamily: "Righteous", fontSizes: [20, 50], rotations: 0}}/>
            </div>) : <div/>
    );
};

export default MusicPreferenceWordCloud;