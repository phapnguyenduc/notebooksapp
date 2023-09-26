import React, { useEffect } from 'react';
import axios from '../config/axios-config';
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row } from 'antd';
import routeConfig from '../config/route-config';
import apiUrlConfig from '../config/api-url-config';

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Home = () => {

    const navigate = useNavigate();

    const onFinish = (values) => {
        if (!localStorage.getItem("token")) {
            axios.post(apiUrlConfig('user-add'), values)
                .then(res => {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("username", values.username);
                    navigate(routeConfig('notes'));
                })
                .catch(error => console.log(error));
        }
        navigate(routeConfig('notes'));
    };

    useEffect(() => {
        let auth = { 'token': localStorage.getItem('token') !== null };

        if (auth.token) {
            navigate(routeConfig('notes'));
        }
    }, []);

    return (
        <>
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row className='username-note'>
                    <Col span={24}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input placeholder='Your name' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item className='form-continue-btn'>
                            <Button className='continue-btn' type="primary" htmlType="submit">
                                Continue
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </>
    )
};
export default Home;