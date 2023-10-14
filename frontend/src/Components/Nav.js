import React from 'react';
import SearchBar from "./SearchBar";
import UploadFile from "./UploadFile";

const Nav = () => (
    <div>
        <SearchBar/>

        <p
            style = {{
                paddingLeft: 20,
                paddingRight: 20
            }}
        > Upload a song</p>
        <UploadFile/>
    </div>
)

export default Nav;