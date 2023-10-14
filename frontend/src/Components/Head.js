import {NavLink} from "react-router-dom";
import {Header} from "antd/es/layout/layout";
import React from "react";
import {theme} from "antd";

const Head = (props) => {
    const {login, setCollapse, collapse} = props;

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Header
            style = {{
                padding: 5,
                background: colorBgContainer,
                textAlign: "center",
                fontSize: "50px"
            }}
        >
            <NavLink to = {"/home"} style = {{color: "black"}}>
                Music Recommendation
            </NavLink>

            {
                login ?
                    <a style = {{color: "black"}} onClick = {() => setCollapse(!collapse)}>
                        <i className = {"gg-profile"} style = {{
                            display: "inline-block",
                            position: "fixed",
                            margin: 20,
                            right: 0
                        }}
                        />
                    </a> :
                    <NavLink to = {"/login"} style = {{color: "black"}}>
                        <i className = {"gg-profile"} style = {{
                            display: "inline-block",
                            position: "fixed",
                            margin: 20,
                            right: 0
                        }}
                        />
                    </NavLink>
            }
        </Header>
    )
}

export default Head;