import { useContext, useState } from "react"
import GraphicContext from "../context";
import {Modal, Form, Input,Radio, Select} from 'antd';
import styles from './customPropertyModal.less';
import MetaDataForm from "./metaDataForm";

type CustomPropertyModal = {
    onOk?: () =>void;
}

export default function CustomPropertyModal (props: CustomPropertyModal) {
    const {onOk = ()=>{}} = props;
    const {state:{modalInfo:{visible},common:{graph}}, useDispatch } = useContext(GraphicContext);
    const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
    console.log('CustomPropertyModal render', useDispatch);
    
    return <Modal visible={visible} onOk={onOk}>
        <Form >
            <Form.Item name="name" label='自定义字段名称'>
                <Input></Input>
            </Form.Item>
            <Form.Item name='isRequired' label='是否必填'>
                <Radio.Group>
                    <Radio></Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="metadata" label='数据元'>
                <Select onChange={(data)=>{
                    setSelectedMetadata(data)
                }}></Select>
            </Form.Item>
        </Form>
        <div className={`${styles.metadataBox} ${!!selectedMetadata ? styles.active:''}`}>
           {selectedMetadata && <MetaDataForm data={selectedMetadata}></MetaDataForm>}
        </div>
    </Modal>
}