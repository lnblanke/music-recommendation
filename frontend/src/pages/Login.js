import React from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {NavLink} from "react-router-dom";

const Login = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
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
    );
}
export default Login;