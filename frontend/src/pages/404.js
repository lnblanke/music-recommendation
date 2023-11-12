import React from 'react';
import {Result} from 'antd';
import {NavLink} from "react-router-dom";

const NotFound = () => (
    <Result
        status = "404"
        title = "404"
        subTitle = "Oops! The page is not found"
        extra = {<NavLink to = {"/home"}> Back Home</NavLink>}
    />
);
export default NotFound;