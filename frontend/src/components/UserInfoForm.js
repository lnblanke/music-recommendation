import React, {useState} from 'react';
import {Input, List, message, Modal, Typography} from 'antd';
import {EditOutlined} from "@ant-design/icons";

const {Text} = Typography

const UserInfoForm = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props
    const [openModel, setOpenModal] = useState(false)
    const [updateItem, setUpdateItem] = useState({})
    const show_data = []
    const edit_data = []

    if (userInfo != null) {
        for (const [key, value] of Object.entries(userInfo)) {
            if (key !== "password") {
                show_data.push({
                    "key": key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
                    "value": value
                })
            }
            if (key !== "user_id") {
                edit_data.push({
                    "key": key.charAt(0).toUpperCase() + key.slice(1),
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

        for (const [key, value] of Object.entries(userInfo)) {
            if (key !== "user_id") {
                edit_data.push({
                    "key": key.charAt(0).toUpperCase() + key.slice(1),
                    "value": value
                })
            }
        }
    }

    return (
        <div>
            <h2> User Info <a onClick = {() => setOpenModal(true)}> <EditOutlined/> </a></h2>
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
            <Modal title = "Edit info" open = {openModel} onOk = {handleOk} onCancel = {handleCancel}>
                <List
                    itemLayout = "horizontal"
                    dataSource = {edit_data}
                    renderItem = {(item) =>
                        (
                            <List.Item>
                                <List.Item.Meta
                                    title = {item.key}
                                />
                                    {
                                        item.key !== "Password"?
                                        <Input
                                            bordered = {false}
                                            size = "small"
                                            defaultValue = {item.value}
                                            style = {{maxWidth: "300px"}}
                                            onChange = {e => setUpdateItem(items => ({...items, [item.key.toLowerCase()]: e.target.value}))}
                                        /> :
                                        <Input.Password
                                            bordered = {false}
                                            size = "small"
                                            defaultValue = {item.value}
                                            style = {{maxWidth: "300px"}}
                                            onChange = {e => setUpdateItem(items => ({...items, [item.key.toLowerCase()]: e.target.value}))}
                                        />
                                    }
                            </List.Item>
                        )
                    }
                />
            </Modal>
        </div>
    );
};

export default UserInfoForm;