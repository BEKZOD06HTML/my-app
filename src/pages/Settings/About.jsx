import React from 'react';
import { Layout, Button, Typography, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles/settings.css';
import './styles/about.css';

const { Text, Title } = Typography;

const About = () => {
  const navigate = useNavigate();

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
            Dastur haqida
          </h1>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '8px' }}>Versiya</Title>
            <Text>1.0.0</Text>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '8px' }}>Dastur haqida</Title>
            <Text style={{ color: '#595959', display: 'block', marginBottom: '16px' }}>
              Ushbu dastur foydalanuvchilarga qulay va samarali xizmat ko'rsatish uchun yaratilgan. 
              Biz doimiy ravishda dasturni yangilab va takomillashtirib boramiz.
            </Text>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <div>
            <Title level={4} style={{ marginBottom: '8px' }}>Litsenziya</Title>
            <Text style={{ color: '#595959' }}>
              © 2024 Barcha huquqlar himoyalangan
            </Text>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About; 