import React from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {NavLink, useNavigate} from "react-router-dom";
import Cookies from "universal-cookie"

const Login = (props) => {
    const {setLogin, setUserInfo, base_url, api_key} = props
    const navigate = useNavigate()
    const cookie = new Cookies()

    const onFinish = async (values) => {
        const request = {
            method: "GET",
            headers: {
                "x-api-key": api_key
            }
        }

        try {
            const response = await(fetch(base_url + `/get-user-info?username=${values["username"]}`, request))
            const data = await (response.json())

            if (response.ok) {
                if (data["data"][0][2] === values["password"]) {
                    setLogin(true);
                    setUserInfo(data["data"][0])

                    if (values["remember"]) {
                        cookie.set("user", values["username"])
                    }

                    navigate("/")
                } else {
                    message.error("Password is incorrect!")
                }
            } else {
                message.error(data["error_message"])
            }
        } catch (e) {
            console.log("Failed request: ", e)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Form
                name = "basic"
                labelCol = {{
                    span: 8,
                }}
                wrapperCol = {{
                    span: 16,
                }}
                style = {{
                    maxWidth: 600,
                }}
                initialValues = {{
                    remember: true,
                }}
                onFinish = {onFinish}
                onFinishFailed = {onFinishFailed}
                autoComplete = "off"
            >
                <Form.Item
                    wrapperCol = {{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <h1> Login </h1>
                </Form.Item>
                <Form.Item
                    label = "Username"
                    name = "username"
                    rules = {[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label = "Password"
                    name = "password"
                    rules = {[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    wrapperCol = {{
                        offset: 8,
                        span: 16,
                    }}>
                    Don't have an account?
                    <NavLink to = {"/signup"}> Sign up now! </NavLink>
                </Form.Item>

                <Form.Item
                    name = "remember"
                    valuePropName = "checked"
                    wrapperCol = {{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol = {{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type = "primary" htmlType = "submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
export default Login;