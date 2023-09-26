import React from 'react';
import { Navigate } from 'react-router-dom';
import LayoutPage from '../components/LayoutPage';
import routeConfig from '../config/route-config';

const PrivateRoute = () => {
    let auth = { 'token': localStorage.getItem('token') !== null };
    return (
        auth.token ? <LayoutPage /> : <Navigate to={routeConfig('root')} />
    )
}

export default PrivateRoute;