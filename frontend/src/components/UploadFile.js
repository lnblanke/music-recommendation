import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, message, Typography, Upload} from 'antd';
import {useNavigate} from "react-router-dom";
const {Title} = Typography

const UploadFile = (prop) => {
    const navigate = useNavigate()
    const {setUploadTS, setAnalyzed, setGenre, api_key} = prop
    const [ts, setTS] = React.useState(null)

    const props = {
        name: 'file',
        action: `https://xpu7xvvdcg.execute-api.us-east-2.amazonaws.com/prod/aws-music-upload/${ts}.mp3`,
        headers: {
            "x-api-key": api_key,
            "X-Requested-With": null,
        },
        method: "PUT",
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                setUploadTS(ts)
                setAnalyzed(false)
                setGenre(null)
                navigate("/analyze")
                info.fileList.pop()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: (file) => {
            if (file.type !== "audio/mpeg") {
                message.error("The uploaded file is not mpeg form!")
            } else {
                setTS(new Date().getTime())
            }

            return file.type === "audio/mpeg" || Upload.LIST_IGNORE;
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            size: "small",
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    return (
        <>
            <Title level={5} style={{paddingLeft: "20px"}}> Upload a song to analyze genre </Title>
            <Upload {...props}>
                <Button
                    icon = {<UploadOutlined/>}
                    size = "middle"
                    style = {{
                    marginLeft: 20,
                    marginRight: 20,
                    width: 260
                }}
                >Click to Upload</Button>
            </Upload>
        </>
    );
}
export default UploadFile;