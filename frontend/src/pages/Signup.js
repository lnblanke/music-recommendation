import React from 'react';
import {
    Button,
    Form,
    Input, message, Select,
} from 'antd';
import {NavLink, useNavigate} from "react-router-dom";

const {Option} = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
const App = (props) => {
    const [form] = Form.useForm();
    const {base_url, api_key} = props
    const navigate = useNavigate()
    const onFinish = async (values) => {
        const request = {
            method: "POST",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                "username": values["username"],
                "password": values["password"],
                "email": values["email"],
                "gender": values["gender"],
                "bio": values["bio"]
            })
        }

        try {
            const response = await(fetch(base_url + `/add-user`, request))
            const data = await (response.json())

            if (response.ok) {
                navigate("/login")
            } else {
                message.error(data["error_message"])
            }
        } catch (e) {
            console.log("Failed request: ", e)
        }
    };
    return (
        <>
            <Form
                {...formItemLayout}
                form = {form}
                name = "signup"
                onFinish = {onFinish}
                style = {{
                    maxWidth: 600,
                }}
                scrollToFirstError
            >
                <Form.Item
                    wrapperCol = {{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <h1> Signup </h1>
                </Form.Item>

                <Form.Item
                    name = "username"
                    label = "Username"
                    rules = {[
                        {
                            required: true,
                            message: 'Please input your username!',
                            whitespace: true,
                        },
                        {
                            max: 100,
                            message: "The username is too long!"
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name = "email"
                    label = "E-mail"
                    rules = {[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name = "password"
                    label = "Password"
                    rules = {[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            min: 8,
                            message: "The password is too short"
                        },
                        {
                            max: 100,
                            message: "The password is too long"
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name = "confirm"
                    label = "Confirm Password"
                    dependencies = {['password']}
                    hasFeedback
                    rules = {[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name = "gender"
                    label = "Gender"
                    rules = {[
                        {
                            required: true,
                            message: 'Please select gender!',
                        },
                    ]}
                >
                    <Select placeholder = "select your gender">
                        <Option value = "male">Male</Option>
                        <Option value = "female">Female</Option>
                        <Option value = "other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name = "bio"
                    label = "Bio"
                >
                    <Input.TextArea showCount maxLength = {100}/>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <div>
                        Already have an account?
                        <NavLink to = {"/login"}> Login </NavLink>
                    </div>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type = "primary" htmlType = "submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default App;