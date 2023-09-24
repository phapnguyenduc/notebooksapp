import React from 'react';
import { Layout } from 'antd';
import { Outlet } from "react-router-dom";

const { Header, Footer, Content } = Layout;

const LayoutPage = () => {
    return (
        <>
            <Header className='header-style'><h2>Notebooks</h2></Header>
            <Content className='content-style'>
                <div className='container h-100'>
                    <Outlet />
                </div>
            </Content>
            <Footer className='footer-style'>Notebook Application</Footer>
        </>
    )
}

export default LayoutPage;