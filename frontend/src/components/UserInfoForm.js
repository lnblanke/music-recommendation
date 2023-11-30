import React, {useState} from 'react';
import {Button, Form, Input, List, message, Modal, Select, Typography} from 'antd';
import {EditOutlined} from "@ant-design/icons";
import {useForm} from "antd/es/form/Form";

const {Text} = Typography
const {Option} = Select

const UserInfoForm = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props
    const [openModel, setOpenModal] = useState(false)
    const [updateItem, setUpdateItem] = useState({})
    const [form] = useForm()
    const show_data = []

    if (userInfo != null) {
        for (const [key, value] of Object.entries(userInfo)) {
            if (key !== "password") {
                show_data.push({
                    "key": key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
                    "value": value
                })
            }
        }
    }

    const handleOk = async () => {
        if (updateItem === {}) {
            setOpenModal(false)
            return
        }

        let req_body = {
            "user_id": userInfo["user_id"]
        }

        for (const [key, value] of Object.entries(updateItem)) {
            req_body[key] = value
        }

        const request = {
            method: "PUT",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify(req_body)
        }

        try {
            const response = await (fetch(base_url + `/change-user-info`, request))
            const data = await (response.json())

            if (response.ok) {
                message.info("User info successfully updated!")
                setOpenModal(false)

                for (const [key, value] of Object.entries(updateItem)) {
                    setUserInfo(item => ({...item, [key]: value}))
                }
            } else {
                message.error(`Updated failed: ${data["error_message"]}`)
            }
        } catch (e) {
        }
    }

    const handleCancel = () => {
        setOpenModal(false)
        setUpdateItem({})

        form.resetFields()
    }

    return (
        <div>
            <h2> User Info
                <Button
                    type = "link"
                    shape = "circle"
                    size = "large"
                    onClick = {() => setOpenModal(true)}
                > <EditOutlined/> </Button>
            </h2>
            <List
                itemLayout = "horizontal"
                dataSource = {show_data}
                renderItem = {(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title = {item.key}
                        />
                        <Text
                            style = {{minWidth: 200, textAlign: "right"}}
                        >
                            {item.value}
                        </Text>
                    </List.Item>
                )}
            />
            {
                userInfo == null? <div/> :
                <Modal title = "Edit info" open = {openModel} onOk = {handleOk} onCancel = {handleCancel}>
                    <Form
                        form = {form}
                        labelCol = {{
                            xs: {
                                span: 24,
                            },
                            sm: {
                                span: 8,
                            }
                        }}
                        wrapperCol = {{
                            xs: {
                                span: 24,
                            },
                            sm: {
                                span: 16,
                            }
                        }}
                        onValuesChange={e => {
                            for (const [key, value] of Object.entries(e)) {
                                setUpdateItem(item => ({...item, [key]: value}))
                            }
                        }}
                    >
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
                            initialValue = {userInfo["username"]}
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
                            initialValue = {userInfo["email"]}
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
                            initialValue = {userInfo["gender"]}
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
                            initialValue = {userInfo["bio"]}
                        >
                            <Input.TextArea showCount maxLength = {100}/>
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </div>
    );
};

export default UserInfoForm;