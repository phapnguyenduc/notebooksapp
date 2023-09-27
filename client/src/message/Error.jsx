import React from 'react';
import { Alert, Space } from 'antd';
const Error = ({ data }) => (
    <Space
        direction="vertical"
        className='w-100'
    >
        <Alert message={data.message} type="error" />
    </Space>
);
export default Error;