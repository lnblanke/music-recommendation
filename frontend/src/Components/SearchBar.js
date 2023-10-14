import React from 'react';
import {Input, Space} from 'antd';

const {Search} = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);
const SearchBar = () => (
    <Space direction = "vertical">
        <Search
            placeholder = "Search"
            onSearch = {onSearch}
            style = {{
                width: 260,
                margin: 20,
                fontFamily: "Orbitron"

            }}
            size = "middle"
        />
    </Space>
);
export default SearchBar;