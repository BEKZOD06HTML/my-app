import React from 'react';
import { Layout, Button, List, Typography } from 'antd';
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './styles/settings.css';
import './styles/help.css';

const { Text } = Typography;

const Help = () => {
  const navigate = useNavigate();

  const helpItems = [
    {
      title: 'Tez-tez so\'raladigan savollar',
      description: 'Ko\'p beriladigan savollarga javoblar'
    },
    {
      title: 'Qo\'llanma',
      description: 'Dasturdan foydalanish bo\'yicha qo\'llanma'
    },
    {
      title: 'Murojaat qilish',
      description: 'Texnik yordam uchun murojaat'
    }
  ];

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
            Yordam
          </h1>
        </div>

        <List
          style={{ 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          dataSource={helpItems}
          renderItem={(item) => (
            <List.Item
              style={{ 
                padding: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={() => console.log('Clicked:', item.title)}
            >
              <div style={{ flex: 1 }}>
                <Text strong>{item.title}</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: '14px' }}>
                  {item.description}
                </Text>
              </div>
              <RightOutlined style={{ color: '#bfbfbf' }} />
            </List.Item>
          )}
        />
      </div>
    </Layout>
  );
};

export default Help; 