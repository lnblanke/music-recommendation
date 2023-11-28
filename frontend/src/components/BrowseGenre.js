import React, {useEffect} from 'react';
import {Menu, message, Typography} from 'antd';
import {useNavigate} from "react-router-dom";
const {Title} = Typography

const BrowseGenre = (props) => {
    const {genre, setGenre, base_url, api_key} = props
    const [item, setItem] = React.useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getGenre = async() => {
            const request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            try {
                const response = await (fetch(base_url + `/get-genre`, request))
                const data = await (response.json())

                if (response.ok) {
                    await setItem(data["data"].map(item => ({
                        key: item,
                        label: item
                    })))
                } else {
                    message.error(`Error: ${data["error-message"]}`)
                }
            } catch (e) {
            }
        }

        getGenre().catch(console.error)
    });

    return (
        <>
            <Title level={5} style={{paddingLeft: "20px"}}> Browse songs by genre </Title>
            <Menu
                mode = "vertical"
                items = {item}
                style = {{height: "60%", overflow: "auto"}}
                selectedKeys = {genre == null? []: [genre]}
                onClick = {(item, _) => {
                    if (genre !== item["key"])
                        setGenre(item["key"])
                    else
                        setGenre(null)

                    navigate("/home")
                }}
            />
        </>
    );
}
export default BrowseGenre;