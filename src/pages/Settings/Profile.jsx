import React from 'react';
import { Layout, Form, Input, Button, Avatar } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
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
            Shaxsiy ma'lumotlar
          </h1>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '24px' 
          }}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#1677ff',
                cursor: 'pointer'
              }}
            />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              label="Ism familiya"
              name="fullName"
              rules={[{ required: true, message: 'Iltimos, ism familiyangizni kiriting' }]}
            >
              <Input 
                size="large" 
                placeholder="Ism familiyangizni kiriting"
              />
            </Form.Item>

            <Form.Item
              label="Telefon raqam"
              name="phone"
              rules={[{ required: true, message: 'Iltimos, telefon raqamingizni kiriting' }]}
            >
              <Input 
                size="large"
                placeholder="+998 00 000 00 00"
              />
            </Form.Item>

            <Form.Item
              label="Elektron pochta"
              name="email"
              rules={[
                { required: true, message: 'Iltimos, elektron pochtangizni kiriting' },
                { type: 'email', message: 'Noto\'g\'ri elektron pochta formati' }
              ]}
            >
              <Input 
                size="large"
                placeholder="test@mail.com"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                block
              >
                Saqlash
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 