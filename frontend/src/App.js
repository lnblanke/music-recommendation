import React from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {ConfigProvider, Layout, theme} from 'antd';
import Login from "./pages/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import Nav from "./Components/Nav";
import Signup from "./pages/Signup";
import "./App.css"
import Head from "./Components/Head";
import Home from "./pages/Home";

const {Content, Sider} = Layout;
[
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));
const App = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [login, setLogin] = React.useState(false)
    const [collapse, setCollapse] = React.useState(true)

    // Sample Items for MusicCard
    const items = []
    for (let i = 0; i < 10; i++)
        items.push({
            id: i,
            song: "Sample song " + i,
            singer: "Sample singer " + i,
            album: "Sample album " + i
        })

    return (
        <ConfigProvider
            theme = {{
                token: {
                    fontFamily: "Righteous"
                }
            }}
        >
            <Layout hasSider>
                <Sider
                    style = {{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    width = {300}
                    theme = {"light"}
                >
                    <Nav/>
                </Sider>
                <Layout
                    className = "site-layout"
                    style = {{
                        marginLeft: 300,
                    }}
                >
                    <Head login = {login} setCollapse = {setCollapse} collapse = {collapse}/>
                    <Content
                        style = {{
                            margin: '24px 16px 0',
                            overflow: 'initial',
                            height: "auto",
                            minHeight: "100vh"
                        }}
                    >

                        <div
                            style = {{
                                padding: 24,
                                height: "auto",
                                minHeight: "100vh",
                                background: colorBgContainer,
                            }}
                        >
                            <Routes>
                                <Route path = {"/home"} element = {<Home items = {items}/>}/>
                                <Route path = {"/login"} element = {<Login/>}/>
                                <Route path = {"/signup"} element = {<Signup/>}/>
                                <Route path = {"/"} element = {<Navigate to = {"/home"}/>}/>
                            </Routes>
                        </div>
                    </Content>
                </Layout>


                <Sider
                    collapsible
                    collapsed = {collapse}
                    collapsedWidth = {0}
                    style = {{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    width = {300}
                    theme = {"light"}
                >
                </Sider>
            </Layout>
        </ConfigProvider>
    );
};
export default App;