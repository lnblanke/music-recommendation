import UserInfoForm from "../components/UserInfoForm";
import MusicPreferenceWordCloud from "../components/MusicPreferenceWordCloud";
import {useEffect} from "react";
import React from 'react';
import {message} from "antd";

const User = (props) => {
    const {base_url, api_key, userInfo, setUserInfo, setGenre} = props
    const [preferences, setPreferences] = React.useState(null)

    useEffect(() => {
        const getPreferences = async () => {
            if (userInfo == null) return;

            let request = {
                method: "GET",
                headers: {
                    "x-api-key": api_key
                }
            }

            try {
                const response = await (fetch(base_url + `/get-preferences?user_id=${userInfo["user_id"]}`, request))
                const data = await response.json()

                if (response.ok) {
                    setPreferences(data["data"])
                } else {
                    message.error(`Error: ${data["error-message"]}`)
                }
            } catch (e) {
            }
        }

        getPreferences().catch(console.error)

        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    }, [userInfo, base_url, api_key]);

    return React.useMemo(() => (
        <div>
            <UserInfoForm base_url = {base_url} api_key = {api_key} userInfo = {userInfo} setUserInfo = {setUserInfo}/>
            <MusicPreferenceWordCloud preferences = {preferences} setGenre = {setGenre}/>
        </div>
    ), [base_url, api_key, userInfo, setUserInfo, preferences, setGenre])
}

export default User;