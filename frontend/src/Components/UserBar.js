import React from 'react';
import SearchBar from "./SearchBar";
import UploadFile from "./UploadFile";
import {CloseOutlined, HistoryOutlined, PoweroffOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";

const UserBar = (props) => {
    const {userInfo, setUserInfo, setLogin, setCollapse} = props
    const navigate = useNavigate()
    const cookie = new Cookies()
    const item = [
        {
            key: 0,
            icon: React.createElement(SettingOutlined),
            label: "Setting"
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
        },
        {
            key: 3,
            icon: React.createElement(CloseOutlined),
            label: "Close",
            style: {bottom: 0}
        }
    ]

    const click = (item) => {
        switch (item["key"]) {
            case "0":
                setCollapse(true)
                navigate("/setting")
                break
            case "1":
                setCollapse(true)
                navigate("/history")
                break
            case "2":
                setCollapse(true)
                setLogin(false)
                setUserInfo(null)
                cookie.remove("user")
                navigate("/")
                break
            case "3":
                setCollapse(true)
                break
        }
    }

    return (
        <div>
            <h1 style={{margin: "40px", fontSize: "30px"}}> Hello {userInfo[1]}! </h1>
            <Menu mode="vertical" onClick={click} items = {item}/>
        </div>
    )
}

export default UserBar;