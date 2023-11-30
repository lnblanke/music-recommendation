import React from 'react';
import {HistoryOutlined, PoweroffOutlined, UserOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";

const UserBar = (props) => {
    const {userInfo, setUserInfo, setLogin, setCollapse, setGenre} = props
    const navigate = useNavigate()
    const cookie = new Cookies()
    const item = [
        {
            key: 0,
            icon: React.createElement(UserOutlined),
            label: "User"
        },
        {
            key: 1,
            icon: React.createElement(HistoryOutlined),
            label: "History"
        },
        {
            key: 2,
            icon: React.createElement(PoweroffOutlined),
            label: "Logout"
        }
    ]

    const click = (item) => {
        switch (item["key"]) {
            case "0":
                setCollapse(true)
                setGenre(null)
                navigate("/user")
                break
            case "1":
                setCollapse(true)
                setGenre(null)
                navigate("/history")
                break
            case "2":
                setCollapse(true)
                setLogin(false)
                setUserInfo(null)
                cookie.remove("user")
                navigate("/")
                break
            default:
        }
    }

    return (
        <div>
            <h1 style={{margin: "40px", fontSize: "30px"}}> Hello {userInfo["username"]}! </h1>
            <Menu mode="vertical" onClick={click} items = {item} selectedKeys={[]}/>
        </div>
    )
}

export default UserBar;