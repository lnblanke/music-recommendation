import React from 'react';
import {Input, List, message, Typography} from 'antd';

const { Text } = Typography;

const UserInfoForm = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props
    const cols = ["", "Username", "Password", "Email", "Gender", "Bio"]
    const info = []
    const [messageAPI, context] = message.useMessage()

    if (userInfo != null) {
        for (let i = 1; i < userInfo.length; i++)
            info.push([i, userInfo[i]])
    }

    const updateUser = async (index, event) => {
        const request = {
            method: "PUT",
            headers: {
                "x-api-key": api_key
            },
            body: JSON.stringify({
                "user_id": userInfo[0],
                [cols[index].toLowerCase()]: event.target.value
            })
        }

        try {
            const response = await(fetch(base_url + `/change-user-info`, request))
            const data = await (response.json())

            if (response.ok) {
                messageAPI.open({
                    type: "info",
                    content: cols[index] + " successfully updated!"
                })

                userInfo[index] = event.target.value

                setUserInfo(userInfo)

                for (let i = 1; i < userInfo.length; i++)
                    info.push([i, userInfo[i]])
            } else {
                messageAPI.open({
                    type: "error",
                    content: data["error_message"],
                })

                setUserInfo(userInfo)
            }
        } catch (e) {
            console.log("Failed request: ", e)
        }
    }

    return (
        <div>
            {context}
            <h2> User Info </h2>
            <List
                itemLayout="horizontal"
                dataSource={info}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={cols[item[0]]}
                        />

                        {
                            cols[item[0]] === "Password"?
                                <Input.Password
                                    bordered={false}
                                    size="small"
                                    defaultValue={item[1]}
                                    onPressEnter={e=>updateUser(item[0], e)}
                                    style={{width: 200}}
                                /> :
                                <Input
                                    bordered={false}
                                    size="small"
                                    defaultValue={item[1]}
                                    onPressEnter={e=>updateUser(item[0], e)}
                                    style={{width: 200}}
                                />
                        }
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserInfoForm;