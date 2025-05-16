import React, { useState } from 'react';
import { useSettings } from '../context/SettingProvider';
import api from '../api/axiosConfig';

const CompeteForm = () => {
  const { settings, updateSettings } = useSettings();
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    const invitation = {
      username,
      language: settings.language,
      testMode: settings.testMode,
      ...(settings.testMode === 'wordBased'
        ? { wordCount: settings.wordCount }
        : { timeDuration: settings.timeDuration }),
    };
    try {
      const response = await api.post('/compete', invitation);
      console.log('Competition invitation sent:', response.data);
    } catch (error) {
      console.error('Error sending competition invitation:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0E0F15',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '0 auto', 
        marginTop: '50px',
        color: '#F4F4F5',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)', 
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Send a Competition Invite
      </h2>
      <div style={{ marginBottom: '15px' }}>
        <label
          htmlFor="username"
          style={{ display: 'block', marginBottom: '5px', color: '#F4F4F5' }}
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#141723',
            color: '#F4F4F5',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label
          htmlFor="language"
          style={{ display: 'block', marginBottom: '5px', color: '#F4F4F5' }}
        >
          Language
        </label>
        <select
          id="language"
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#141723',
            color: '#F4F4F5',
          }}
        >
          <option value="English">English</option>
          <option value="Myanmar">Myanmar</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label
          style={{ display: 'block', marginBottom: '5px', color: '#F4F4F5' }}
        >
          Test Mode
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={() => updateSettings({ testMode: 'wordBased' })}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor:
                settings.testMode === 'wordBased' ? '#141723' : '#0E0F15',
              color: settings.testMode === 'wordBased' ? '#F4F4F5' : '#777C90',
              cursor: 'pointer',
            }}
          >
            Word Based
          </button>
          <button
            onClick={() => updateSettings({ testMode: 'timeBased' })}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor:
                settings.testMode === 'timeBased' ? '#141723' : '#0E0F15',
              color: settings.testMode === 'timeBased' ? '#F4F4F5' : '#777C90',
              cursor: 'pointer',
            }}
          >
            Time Based
          </button>
        </div>
        {settings.testMode === 'wordBased' ? (
          <select
            value={settings.wordCount}
            onChange={(e) =>
              updateSettings({ wordCount: Number(e.target.value) })
            }
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#141723',
              color: '#F4F4F5',
            }}
          >
            <option value={30}>30 Words</option>
            <option value={60}>60 Words</option>
            <option value={120}>120 Words</option>
          </select>
        ) : (
          <select
            value={settings.timeDuration}
            onChange={(e) =>
              updateSettings({ timeDuration: Number(e.target.value) })
            }
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#141723',
              color: '#F4F4F5',
            }}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
        )}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#141723',
          color: '#F4F4F5',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Send Invitation
      </button>
    </div>
  );
};

export default CompeteForm;