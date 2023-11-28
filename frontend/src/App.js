import React, {useEffect} from 'react';
import {ConfigProvider, Drawer, Layout, message, theme} from 'antd';
import Login from "./pages/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import Signup from "./pages/Signup";
import "./App.css"
import Head from "./components/Head";
import Home from "./pages/Home";
import UserBar from "./components/UserBar";
import Cookies from "universal-cookie";
import User from "./pages/User";
import Analyze from "./pages/Analyze";
import SearchBar from "./components/SearchBar";
import UploadFile from "./components/UploadFile";
import NotFound from "./pages/404";
import History from "./pages/History"
import Search from "./pages/Search";
import BrowseGenre from "./components/BrowseGenre";

const {Content, Sider} = Layout;
const base_url = "https://d7mnlmmxka.execute-api.us-east-2.amazonaws.com/dev"
const ml_url = "https://nti8t75j5a.execute-api.us-east-2.amazonaws.com/Prod"
const api_key = "YE8iRuDxUl9Dsrgv4YSYw2N78epi6fIeQaG18OUj"

const App = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [login, setLogin] = React.useState(false)
    const [collapse, setCollapse] = React.useState(true)
    const [userInfo, setUserInfo] = React.useState(null)
    const [loadCookie, setLoadCookie] = React.useState(false)
    const [uploadTS, setUploadTS] = React.useState(null)
    const [analyzed, setAnalyzed] = React.useState(false)
    const [prompt, setPrompt] = React.useState(null)
    const [searched, setSearched] = React.useState(false)
    const [genre, setGenre] = React.useState(null)
    const cookie = new Cookies()

    useEffect(() => {
        if (loadCookie) return;

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
                    await setLogin(true);
                    await setUserInfo(data["data"])
                    await setLoadCookie(true)
                } else {
                    message.error(`Error: ${data["error-message"]}`)
                }
            } catch (e) {
            }
        }

        if (cookie.get("user") !== undefined) getUser(cookie.get("user")).catch(console.error)
        else setLoadCookie(true)
    }, [loadCookie, cookie])

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
                    <SearchBar setPrompt = {setPrompt} setSearched = {setSearched}/>
                    <UploadFile
                        uploadTS = {uploadTS}
                        setUploadTS = {setUploadTS}
                        setAnalyzed = {setAnalyzed}
                        api_key = {api_key}
                    />
                    <BrowseGenre
                        genre = {genre}
                        setGenre = {setGenre}
                        base_url = {base_url}
                        api_key = {api_key}
                    />
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
                                <Route path = "/home" element = {
                                    <Home
                                        getUserInfo = {React.useCallback(() => userInfo, [userInfo])}
                                        loadCookie = {loadCookie}
                                        genre = {genre}
                                        base_url = {base_url}
                                        ml_url = {ml_url}
                                        api_key = {api_key}
                                    />}
                                />
                                <Route path = "/login" element = {
                                    <Login
                                        setLogin = {setLogin}
                                        setUserInfo = {setUserInfo}
                                        base_url = {base_url}
                                        api_key = {api_key}
                                    />}
                                />
                                <Route path = "/signup" element = {
                                    <Signup
                                        base_url = {base_url}
                                        api_key = {api_key}
                                    />}
                                />
                                <Route path = "/user" element = {
                                    <User
                                        base_url = {base_url}
                                        api_key = {api_key}
                                        userInfo = {userInfo}
                                        setUserInfo = {setUserInfo}
                                        setGenre = {setGenre}
                                    />}
                                />
                                <Route path = "/history" element = {
                                    <History
                                        userInfo = {userInfo}
                                        base_url = {base_url}
                                        api_key = {api_key}
                                    />}
                                />
                                <Route path = "/analyze" element = {
                                    <Analyze
                                        getUserInfo = {React.useCallback(() => userInfo, [userInfo])}
                                        uploadTS = {uploadTS}
                                        setUploadTS = {setUploadTS}
                                        analyzed = {analyzed}
                                        setAnalyzed = {setAnalyzed}
                                        ml_url = {ml_url}
                                        base_url = {base_url}
                                        api_key = {api_key}
                                    />}
                                />
                                <Route path = "/search" element = {
                                    <Search
                                        prompt = {prompt}
                                        setPrompt = {setPrompt}
                                        searched = {searched}
                                        setSearched = {setSearched}
                                        userInfo = {userInfo}
                                        base_url = {base_url}
                                        api_key = {api_key}
                                    />}
                               />
                                <Route path = "/404" element = {<NotFound/>}/>
                                <Route path = "/" element = {<Navigate to = "/home"/>}/>
                                <Route path = "*" element = {<Navigate to = "/404"/>}></Route>
                            </Routes>
                        </div>
                    </Content>
                </Layout>

                {
                    login ?
                        (<Drawer
                            open = {! collapse}
                            onClose = {() => setCollapse(true)}
                        >
                            <UserBar userInfo = {userInfo}
                                     setLogin = {setLogin}
                                     setUserInfo = {setUserInfo}
                                     setCollapse = {setCollapse}
                            />
                        </Drawer>) : (<div/>)
                }
            </Layout>
        </ConfigProvider>
    );
};
export default App;