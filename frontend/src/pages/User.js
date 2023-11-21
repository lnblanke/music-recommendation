import UserInfoForm from "../components/UserInfoForm";
import MusicPreferenceWordCloud from "../components/MusicPreferenceWordCloud";
import {useEffect} from "react";
import React from 'react';

const User = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props;
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
                    console.log("Error", data["error-message"])
                }
            } catch (e) {
                console.log("Failed request: ", e)
            }
        }

        getPreferences().catch(console.error)
    });

    return (
        <div>
            <UserInfoForm base_url = {base_url} api_key = {api_key} userInfo = {userInfo} setUserInfo = {setUserInfo}/>
            <MusicPreferenceWordCloud preferences = {preferences}/>
        </div>
    )
}

export default User;