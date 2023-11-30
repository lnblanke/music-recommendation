import React from 'react';
import {Input, Space} from 'antd';
import {useNavigate} from "react-router-dom";

const {Search} = Input;

const SearchBar = (props) => {
    const {setPrompt, setSearched, setGenre} = props
    const navigate = useNavigate()

    const onSearch = (value, _) => {
        if (value === "") return

        setPrompt(value)
        setSearched(false)
        setGenre(null)
        navigate("/search")
    }

    return (
        <Space direction = "vertical">
            <Search
                placeholder = "Search"
                onSearch = {onSearch}
                style = {{
                    width: 260,
                    margin: 20,
                }}
                size = "middle"
                maxLength = {30}
            />
        </Space>
    );
}
export default SearchBar;