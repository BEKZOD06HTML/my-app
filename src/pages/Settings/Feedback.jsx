import React from 'react';
import { Layout, Form, Input, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Text } = Typography;

const Feedback = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Feedback values:', values);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        width: '100%',
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px 16px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '24px',
          gap: '12px'
        }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            type="text"
            onClick={() => navigate('/settings')}
          />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            margin: 0,
            color: '#262626'
          }}>
            Taklif va shikoyatlar
          </h1>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}>
          <Text style={{ 
            display: 'block', 
            marginBottom: '24px',
            color: '#595959'
          }}>
            Bizning xizmatimizni yaxshilash uchun o'z fikringizni bildiring
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              name="subject"
              rules={[{ required: true, message: 'Iltimos, mavzuni kiriting' }]}
            >
              <Input 
                size="large"
                placeholder="Mavzu"
              />
            </Form.Item>

            <Form.Item
              name="message"
              rules={[{ required: true, message: 'Iltimos, xabarni kiriting' }]}
            >
              <TextArea 
                rows={4}
                placeholder="Xabar matni"
                style={{ resize: 'none' }}
              />
            </Form.Item>

            <Form.Item
              name="contact"
              rules={[{ required: true, message: 'Iltimos, aloqa ma\'lumotlarini kiriting' }]}
            >
              <Input 
                size="large"
                placeholder="Aloqa uchun ma'lumot (telefon yoki email)"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                block
              >
                Yuborish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback; 