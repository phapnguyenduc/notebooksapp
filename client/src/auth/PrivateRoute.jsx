import React from 'react';
import { Navigate } from 'react-router-dom';
import LayoutPage from '../components/LayoutPage';

const PrivateRoute = () => {
    let auth = { 'token': localStorage.getItem('token') !== null };
    return (
        auth.token ? <LayoutPage /> : <Navigate to='/' />
    )
}

export default PrivateRoute;