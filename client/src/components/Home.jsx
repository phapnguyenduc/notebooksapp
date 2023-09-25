import React from 'react';
import axios from '../axios-config';
import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values) => {
    axios.post('/user/add', values)
        .then(res => {
            if (!localStorage.getItem("token")) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("id", res.data.id);
            }

            console.log(res);
            // window.location.replace('/');
        });
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Home = () => (
    <Form
        name="basic"
        labelCol={{
            span: 8,
        }}
        wrapperCol={{
            span: 16,
        }}
        style={{
            maxWidth: 600,
        }}
        initialValues={{
            remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item
            label="Username"
            name="username"
            rules={[
                {
                    required: true,
                    message: 'Please input your username!',
                },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
        >
            <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
);
export default Home;