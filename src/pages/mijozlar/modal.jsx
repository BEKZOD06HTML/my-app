import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const AddDebtorModal = ({ isOpen, onClose, onAddDebtor }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [fileList, setFileList] = useState([]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // FormData yaratamiz
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("address", values.address || "");
      formData.append("comment", values.comment || "");
      formData.append(
        "phone_numbers",
        phoneNumbers.filter((num) => num.trim() !== "").join(",")
      );
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj || file);
      });

      await onAddDebtor(formData);
      form.resetFields();
      setPhoneNumbers([""]);
      setFileList([]);
    } catch (err) {
      console.error("Modalda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const updatePhoneNumber = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title="Yangi mijoz qo'shish"
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setPhoneNumbers([""]);
        setFileList([]);
        onClose();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Qo'shish"
      cancelText="Bekor qilish"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="full_name"
          label="Ism Familiya"
          rules={[{ required: true, message: "Iltimos ismni kiriting" }]}
        >
          <Input />
        </Form.Item>

        <label>Telefon raqamlar *</label>
        {phoneNumbers.map((phone, index) => (
          <Input
            key={index}
            value={phone}
            onChange={(e) => updatePhoneNumber(index, e.target.value)}
            placeholder="Telefon raqam"
            style={{ marginBottom: "10px" }}
          />
        ))}
        <Button type="dashed" onClick={addPhoneNumber} icon={<PlusOutlined />}>
          Ko'proq qo'shish
        </Button>

        <Form.Item name="address" label="Yashash manzili">
          <Input placeholder="Yashash manzilini kiriting" />
        </Form.Item>

        <Form.Item name="comment" label="Eslatma">
          <Input.TextArea rows={3} placeholder="Qo'shimcha eslatma..." />
        </Form.Item>

        <Form.Item label="Rasm biriktirish">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
            listType="picture-card"
          >
            {fileList.length < 2 && (
              <div>
                <UploadOutlined /> Rasm qo'shish
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDebtorModal;
