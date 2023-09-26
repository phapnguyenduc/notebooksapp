import { Button, Row, Col, Space, Tag, Table } from 'antd';
import React, { useState, useEffect } from "react";
import axios from '../config/axios-config';
import formatDate from '../helper/DateFormatter';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import routeConfig from '../config/route-config';
import apiUrlConfig from '../config/api-url-config';

let endpoints = [
    apiUrlConfig('private-notes')
];

const ListNotes = () => {
    const navigate = useNavigate();

    const [noteData, setNoteData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    const deleteNote = (e) => {
        axios.delete(apiUrlConfig('private-note-delete') + e, {
            headers: {
                'x_authorization': localStorage.getItem("token")
            }
        }).then(response => {
            setNoteData(noteData.filter(ob => ob.id !== e));
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    const onRowNote = (data) => {
        navigate(routeConfig('note-save'), { state: data })
    }

    const fetchMoreData = () => {
        setPageNum(pageNum + 1);
        setTimeout(() => {
            Promise.all(endpoints?.map((url) => axios.get(url + (pageNum + 1),
                {
                    headers: {
                        'x_authorization': localStorage.getItem("token")
                    }
                }
            ))).then((response) => {
                if (response[0].data.length === 0) {
                    setHasMore(false);
                }
                setNoteData(noteData.concat(response[0].data));
            }).catch(error => {
                console.error('There was an error!', error);
            });
        }, 500);
    }

    useEffect(() => {
        const loadNoteData = async () => {
            await Promise.all(endpoints?.map((url) => axios.get(url + pageNum,
                {
                    headers: {
                        'x_authorization': localStorage.getItem("token")
                    }
                })
            )).then(response => {
                setNoteData(response[0].data);
            }).catch(error => {
                console.error('There was an error!', error);
            });
        }
        loadNoteData();
    }, []);


    return (
        <>
            <Row>
                <p>Hi, {localStorage.getItem('username')}</p>
            </Row>
            <Row>
                <Col span={24}>
                    <Button className='btn-add mt-2' type="primary" icon={<PlusCircleOutlined />}
                        onClick={() => { return navigate(routeConfig('note-save')) }}>
                        Add
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <InfiniteScroll
                        className='infinite-scroll'
                        dataLength={noteData.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<p className='loader-scroll'>{noteData.length === 0 ? 'No data' : 'Loading...'}</p>}
                        endMessage={<p className='loader-scroll'>You have seen it all</p>}
                    >
                        {noteData?.map((note, index) => {
                            return (
                                <Row key={note.id} onClick={(e) => {
                                    if (e.target.attributes.getNamedItem('class')?.value.includes('btn-delete') === false) {
                                        onRowNote(note);
                                    }
                                }} className='line-note'>
                                    <Col className='col-note created' span={3}>
                                        {formatDate(note.created_at)}
                                    </Col>
                                    <Col className='col-note content-tag' span={20}>
                                        <Row className='col-note content'>
                                            {note.content?.length > 100 ? note.content.substr(0, 100) + '...' : note.content}
                                        </Row>
                                        <Row className='col-note tag'>
                                            {
                                                note.tags?.map((tag) => {
                                                    return (
                                                        <Tag color="default" key={tag.tag_id}>
                                                            {tag.tag_name.toUpperCase()}
                                                        </Tag>
                                                    );
                                                })
                                            }
                                        </Row>
                                    </Col>
                                    <Col className='col-note button' span={1}>
                                        <Space size="middle">
                                            <Button onClick={(e) => {
                                                deleteNote(note.id)
                                            }}
                                                className='btn-delete'
                                                type="primary" danger icon={<DeleteOutlined />}>
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            )
                        })}
                    </InfiniteScroll>
                </Col>
            </Row>
        </>
    )
}

export default ListNotes;