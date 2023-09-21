import { Input, Button, Row, Col, Space, Tag, Table } from 'antd';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
    {
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => <a>{text}</a>,
    },
    {
        dataIndex: 'content',
        key: 'content',
    },
    // {
    //     key: 'tags',
    //     dataIndex: 'tags',
    //     render: (_, { tags }) => (
    //         <>
    //             {tags.map((tag) => {
    //                 let color = tag.length > 5 ? 'geekblue' : 'green';
    //                 if (tag === 'loser') {
    //                     color = 'volcano';
    //                 }
    //                 return (
    //                     <Tag color={color} key={tag}>
    //                         {tag.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </>
    //     ),
    // },
    {
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button style={{ width: '100%' }} type="primary" danger icon={<DeleteOutlined />}>
                    Delete
                </Button>
            </Space>
        ),
    },
];

const ListNotes = () => {
    const [noteData, setNoteData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/')
            .then(res => {
                console.log(res.data);
                setNoteData(res.data);
            })
            .catch(error => console.log(error));
    }, []);
    return (
        <>
            <Row>
                <Col span={24}>
                    <Button style={{ margin: '10px 0' }} className='mt-2' href='/create' type="primary" icon={<PlusCircleOutlined />}>
                        Add
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table showHeader={false} columns={columns} dataSource={noteData} pagination={{ pageSize: 10 }}/>
                </Col>
            </Row>
        </>
    )
}

export default ListNotes;