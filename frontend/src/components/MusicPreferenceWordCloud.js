import React from "react";
import ReactWordcloud from "react-wordcloud";

// Sample word frequencies
const words = [
    { text: "Rock", value: 10 },
    { text: "Pop", value: 8 },
    { text: "Jazz", value: 6 },
    { text: "Hip-Hop", value: 4 },
    { text: "Electronic", value: 5 },
];

const MusicPreferenceWordCloud = () => {
    return (
        <div>
            <h2> Music Preference </h2>
            <ReactWordcloud words={words}
                            options={{fontFamily: "Righteous", fontSizes: [20, 50], rotations: 0}}/>
        </div>
    );
};

export default MusicPreferenceWordCloud;