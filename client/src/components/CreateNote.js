import TextArea from "antd/es/input/TextArea";
import { Button, Row, Col, Select, Space, Form } from 'antd';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateNote = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [tagData, setTagData] = useState([]);
    const [tagSelect, setTagSelect] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/tags')
            .then(res => {
                const dataConverted = res.data.map((object) => {
                    return {
                        label: "#" + object.name,
                        value: object.id
                    }
                });
                setTagData(dataConverted);
            })
            .catch(error => console.log(error));
    }, []);

    const onSubmitForm = (e) => {
        const data = {
            content: e.content,
            tags: tagSelect
        };
        axios.post('http://localhost:5000/note/create', data)
            .then(res => {
                console.log(res);
                console.log(res.data);
                setContent("");
                navigate('/');
            });
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setTagSelect(value);
    };

    return (
        <>
            <Form
                className="h-100"
                name="noteData"
                layout="vertical"
                labelCol={{
                    span: 24
                }}
                onFinish={onSubmitForm}
            >
                <Form.Item name="tags">
                    <Row className="row-btn">
                        <Col span={15}>
                            <Button className='mt-2 btn-back' href='/' >Back</Button>
                            <Button className='mt-2 btn-save' htmlType="submit" type="primary" >Save</Button>
                        </Col>
                        <Col span={9}>
                            <Space
                                className="space-select"
                                direction="vertical"
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    className="w-100"
                                    placeholder="Choose tags..."
                                    onChange={handleChange}
                                    options={tagData}
                                />
                            </Space>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item name="content" className="h-100">
                    <TextArea className="textarea-style" value={content} onChange={e => {
                        setContent(e.target.value)
                    }} />
                </Form.Item>
                {/* <Row className="row-btn">
                    <Col span={15}>
                        <Button className='mt-2 btn-back' href='/' >Back</Button>
                        <Button className='mt-2 btn-save' href='/' type="primary" >Save</Button>
                    </Col>
                    <Col span={9}>
                        <Space
                            className="space-select"
                            direction="vertical"
                        >
                            <Select
                                name="tags"
                                mode="multiple"
                                allowClear
                                className="w-100"
                                placeholder="Choose tags..."
                                defaultValue={['a10', 'c12']}
                                onChange={handleChange}
                                options={options}
                            />
                        </Space>
                    </Col>
                </Row>
                <Row className="h-100">
                    <TextArea name="content" className="textarea-style" />
                </Row> */}
            </Form>
        </>
    )
}

export default CreateNote;