import { Input, Button, Row, Col, Space, Tag, Table } from 'antd';
import React, { useState, useEffect } from "react";
import axios from '../axios-config';
import formatDate from '../helper/date-fomatter';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const ListNotes = () => {
    const navigate = useNavigate();
    const columns = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            width: '13%',
            render: (date) => (
                <>
                    {formatDate(date)}
                </>
            )
        },
        {
            dataIndex: 'content',
            key: 'content',
            width: '40%',
            render: (content) => (
                <>
                    {content.length > 50 ? content.substr(0, 50) + '...' : content}
                </>
            )
        },
        {
            key: 'tags',
            dataIndex: 'tags',
            width: '40%',
            render: (_, { tags }) => (
                <>
                    {
                        tags?.map((tag) => {
                            return (
                                <Tag color="default" key={tag.tag_id}>
                                    {tag.tag_name.toUpperCase()}
                                </Tag>
                            );
                        })
                    }
                </>
            ),
        },
        {
            key: 'action',
            width: '7%',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => { deleteNote(record.id) }} className='btn-delete' type="primary" danger icon={<DeleteOutlined />}>
                    </Button>
                </Space>
            ),
        },
    ];

    const [noteData, setNoteData] = useState([]);

    let endpoints = [
        '/notes'
    ];

    const loadNoteData = () => {
        return Promise.all(endpoints.map((url) => axios.get(url))).then(function (dataAll) {
            setNoteData(dataAll[0].data);
        });
    }

    const deleteNote = (e) => {
        const url = `note/delete/${e}`;
        axios.delete(url)
            .then(response => {
                loadNoteData();
            }).catch(error => {
                console.error('There was an error!', error);
            });
    }

    useEffect(() => {
        loadNoteData();
    }, []);

    return (
        <>
            <Row>
                <Col span={24}>
                    <Button className='btn-add mt-2' href='/create' type="primary" icon={<PlusCircleOutlined />}>
                        Add
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        rowKey="id"
                        showHeader={false}
                        columns={columns}
                        dataSource={noteData}
                        pagination={{ pageSize: 8 }}
                        scroll={{
                            x: 600,
                            y: 800,
                        }}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    if (event.target.attributes.getNamedItem('class')?.value.includes('delete') ||
                                        event.target.attributes.getNamedItem('data-icon')?.value.includes('delete')) {
                                        deleteNote(record.id);
                                    } else {
                                        navigate("/create", { state: record });
                                    }

                                },
                            };
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default ListNotes;