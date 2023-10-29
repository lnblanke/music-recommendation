import React, {useEffect} from 'react';
import {ConfigProvider, Layout, theme} from 'antd';
import Login from "./pages/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import Nav from "./Components/Nav";
import Signup from "./pages/Signup";
import "./App.css"
import Head from "./Components/Head";
import Home from "./pages/Home";
import UserBar from "./Components/UserBar";
import Cookies from "universal-cookie";
import User from "./pages/User";

const {Content, Sider} = Layout;
const base_url = "https://wrmtvghyf3.execute-api.us-east-2.amazonaws.com/dev"
const api_key = "YE8iRuDxUl9Dsrgv4YSYw2N78epi6fIeQaG18OUj"

const App = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [login, setLogin] = React.useState(false)
    const [collapse, setCollapse] = React.useState(true)
    const [userInfo, setUserInfo] = React.useState()
    const [loadCookie, setLoadCookie] = React.useState(false)
    const cookie = new Cookies()

    useEffect( () => {
        if (cookie.get("user") === null || loadCookie) return;

        const getUser = async (username) => {
            const request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            try {
                const response = await (fetch(base_url + `/get-user-info?username=${username}`, request))
                const data = await (response.json())

                if (response.ok) {
                    setLogin(true);
                    setUserInfo(data["data"][0])
                } else {
                    console.log("Error", data["error-message"])
                }
            } catch (e) {
                console.log("Failed request: ", e)
            }
        }

        getUser(cookie.get("user")).catch(console.error)
        setLoadCookie(true)
    })

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
                                <Route path = {"/login"} element = {<Login setLogin = {setLogin}
                                                                           setUserInfo = {setUserInfo}
                                                                           base_url = {base_url}
                                                                           api_key = {api_key}/>}/>
                                <Route path = {"/signup"} element = {<Signup base_url = {base_url}
                                                                             api_key = {api_key}/>}/>
                                <Route path = {"/user"} element = {<User base_url = {base_url}
                                                                         api_key = {api_key}
                                                                         userInfo = {userInfo}
                                                                         setUserInfo = {setUserInfo}/>}/>
                                <Route path = {"/"} element = {<Navigate to = {"/home"}/>}/>
                            </Routes>
                        </div>
                    </Content>
                </Layout>

                {
                    login ?
                        (<Sider
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
                            <UserBar userInfo = {userInfo}
                                     setLogin = {setLogin}
                                     setUserInfo = {setUserInfo}
                                     setCollapse = {setCollapse}/>
                        </Sider>) : (<div/>)
                }
            </Layout>
        </ConfigProvider>
    );
};
export default App;