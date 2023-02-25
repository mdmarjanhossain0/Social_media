import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { insertToken } from "./store/tokenslice";

const useAuth = () => {
    const dispatch = useDispatch()
    var token = localStorage.getItem("social_media_token")
    console.log("Protected root calling ")
    if (token) {
        dispatch(insertToken(token))
        const user = { loggedIn: true };
        return user && user.loggedIn;
    }
    const user = { loggedIn: false };
    return user && user.loggedIn;
};

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;