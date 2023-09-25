import React from 'react';
import axios from '../axios-config';
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row } from 'antd';

const LIST_OF_NOTES_URL = "/notes";

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Home = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        if (!localStorage.getItem("token")) {
            axios.post('/user/add', values)
                .then(res => {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("id", res.data.id);
                    localStorage.setItem("username", values.username);
                    navigate(LIST_OF_NOTES_URL);
                });
        }
        navigate(LIST_OF_NOTES_URL);
    };
    
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