import UserInfoForm from "../Components/UserInfoForm";
import MusicPreferenceWordCloud from "../Components/MusicPreferenceWordCloud";

const User = (props) => {
    const {base_url, api_key, userInfo, setUserInfo} = props;

    return (
        <div>
            <UserInfoForm base_url = {base_url} api_key = {api_key} userInfo = {userInfo} setUserInfo = {setUserInfo}/>
            <MusicPreferenceWordCloud userInfo = {userInfo}/>
        </div>
    )
}

export default User;