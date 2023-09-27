import React from 'react';
import { Alert, Space } from 'antd';
const Success = ({ data }) => (
  <Space
    direction="vertical"
    className='w-100'
  >
    <Alert message={data.message} type="success" />
  </Space>
);
export default Success;
