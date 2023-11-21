import React from 'react';
import {Input, List, message} from 'antd';
const UserInfoForm = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props

    const data = []

    if (userInfo != null) {
        for (const [key, value] of Object.entries(userInfo)) {
            if (key !== "user_id") {
                data.push({
                    "key": key.charAt(0).toUpperCase() + key.slice(1),
                    "value": value
                })
            }
        }
    }

    const updateUser = async (col, event) => {
        const request = {
            method: "PUT",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                "user_id": userInfo["user_id"],
                [col.toLowerCase()]: event.target.value
            })
        }

        try {
            const response = await(fetch(base_url + `/change-user-info`, request))
            const data = await (response.json())

            if (response.ok) {
                message.info(col + " successfully updated!")

                userInfo[col] = event.target.value
            } else {
                message.error(data["error_message"])
            }
            setUserInfo(userInfo)
        } catch (e) {
            console.log("Failed request: ", e)
        }
    }

    return (
        <div>
            <h2> User Info </h2>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.key}
                        />

                        {
                            item.key === "Password"?
                                <Input.Password
                                    bordered={false}
                                    size="small"
                                    defaultValue={item.value}
                                    onPressEnter={e=>updateUser(item.key, e)}
                                    style={{width: 200, textAlign: "right"}}
                                /> :
                                <Input
                                    bordered={false}
                                    size="small"
                                    defaultValue={item.value}
                                    onPressEnter={e=>updateUser(item.key, e)}
                                    style={{minWidth: 200, textAlign: "right"}}
                                />
                        }
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserInfoForm;