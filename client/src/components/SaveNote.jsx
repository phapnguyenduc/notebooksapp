import TextArea from "antd/es/input/TextArea";
import { Button, Row, Col, Select, Space, Form } from 'antd';
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from '../axios-config';

const CreateNote = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [noteDataForm] = Form.useForm();
    const { state } = useLocation();
    const [content, setContent] = useState("");
    const [tagData, setTagData] = useState([]);
    const [tagSelect, setTagSelect] = useState([]);

    useEffect(() => {
        inputRef.current.focus({
            cursor: 'start',
        });

        if (!state === false) {
            setContent(state?.content);
            setTagSelect(state?.tags ? state?.tags : []);
        }

        noteDataForm.setFieldsValue({
            content: state?.content,
            tags: state?.tags?.map((tag) => {
                return {
                    label: tag.tag_name,
                    value: tag.tag_id
                }
            })
        });


        axios.get('/tags')
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
            tags: tagSelect,
            id: state?.id
        };

        axios.post('/note/save/', data)
            .then(res => {
                window.location.replace('/');
            });
    };

    const handleChange = (value) => {
        setTagSelect(value);
    };

    return (
        <>
            <Form
                className="h-100"
                form={noteDataForm}
                layout="vertical"
                labelCol={{
                    span: 24
                }}
                onFinish={onSubmitForm}
            >
                <Row className="row-btn">
                    <Col xs={{ span: 10 }} lg={{ span: 15 }}>
                        <Button className='mt-2 btn-back' onClick={() => { return navigate('/') }} >Back</Button>
                        <Button className='mt-2 btn-save' htmlType="submit" type="primary" >Save</Button>
                    </Col>
                    <Col xs={{ span: 14 }} lg={{ span: 9 }}>
                        <Space
                            className="space-select"
                            direction="vertical"
                        >
                            <Form.Item name="tags">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    className="w-100"
                                    placeholder="Choose tags..."
                                    onChange={handleChange}
                                    options={tagData}
                                />
                            </Form.Item>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name="content">
                            <TextArea ref={inputRef} className="textarea-style" value={content} onChange={e => {
                                setContent(e.target.value)
                            }} ></TextArea>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default CreateNote;