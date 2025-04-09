import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, List, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Header from '../../components/header/header';
const { Text } = Typography;

const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      header: 'Asosiy',
      items: [
        {
          title: "Shaxsiy ma'lumotlar",
          path: '/settings/profile'
        },
        {
          title: 'Xavfsizlik',
          path: '/settings/security'
        }
      ]
    },
    {
      header: 'Boshqa',
      items: [
        {
          title: 'Yordam',
          path: '/settings/help'
        },
        {
          title: 'Taklif va shikoyatlar',
          path: '/settings/feedback'
        },
        {
          title: 'Dastur haqida',
          path: '/settings/about'
        },
        {
          title: 'Ommaviy oferta',
          path: '/settings/terms'
        },
        {
          title: 'Maxfiylik siyosati',
          path: '/settings/privacy'
        }
      ]
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <div style={{ 
        width: '100%',
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px 16px',
        '@media (max-width: 600px)': {
          padding: '16px 12px'
        }
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600',
          marginBottom: '24px',
          color: '#262626'
        }}>
          Sozlamalar
        </h1>

        {menuItems.map((section, index) => (
          <div key={index} style={{ marginBottom: '24px' }}>
            <Text style={{ 
              fontSize: '14px',
              color: '#1677ff',
              marginBottom: '8px',
              display: 'block'
            }}>
              {section.header}
            </Text>
            <List
              style={{ 
                background: 'white', 
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
              dataSource={section.items}
              renderItem={(item) => (
                <List.Item
                  style={{ 
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => navigate(item.path)}
                  className="settings-list-item"
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <Text>{item.title}</Text>
                    <RightOutlined style={{ color: '#bfbfbf' }} />
                  </div>
                </List.Item>
              )}
            />
          </div>
        ))}

        <Button 
          danger 
          type="text"
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '14px 16px',
            height: 'auto',
            color: '#ff4d4f',
            background: 'white',
            borderRadius: '8px',
            marginTop: '24px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          onClick={() => navigate('/login')}
        >
          Chiqish
        </Button>
      </div>
    </Layout>
  );
};

export default Settings; 