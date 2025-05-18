import React, { useState } from 'react';
import { useSettings } from '../context/SettingProvider';
import api from '../api/axiosConfig';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const CompeteForm = () => {
  const { settings, updateSettings } = useSettings();
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false);

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
      const response = await api.post('http://localhost:8181/compete', invitation);
      console.log('Competition invitation sent:', response.data);
      setOpen(false);
      toast.success(`Successfully sent competition invite to ${username}.`, {
        style: {
          backgroundColor: '#141723',
          color: '#F4F4F5',
          border: '1px solid #141723',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '12px',
        },
        duration: 5000,
      });
      setUsername('');
    } catch (error) {
      console.error('Error sending competition invitation:', error);
      setOpen(false);
      toast.error('Failed to send competition invite. Please try again.', {
        style: {
          backgroundColor: '#141723',
          color: '#F4F4F5',
          border: '1px solid #141723',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '12px',
        },
        duration: 5000,
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0E0F15',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        margin: '0 auto',
        marginTop: '50px',
        color: '#F4F4F5',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(244, 244, 245, 0.1)',
        border: '4px solid #141723', // Fixed: Hardcoded the border color
        fontFamily: '"Press Start 2P", monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '20px',
          textShadow: '0 0 5px #F4F4F5',
          letterSpacing: '2px',
        }}
      >
        Send a Competition Invite
      </h2>
      <div style={{ marginBottom: '20px' }}>
        <Label
          htmlFor="username"
          style={{ display: 'block', marginBottom: '8px', color: '#F4F4F5', fontSize: '12px' }}
        >
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full bg-[#141723] text-[#F4F4F5] border-none rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F4F4F5] transition-all duration-200"
          style={{ fontFamily: 'inherit', fontSize: '12px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Label
          htmlFor="language"
          style={{ display: 'block', marginBottom: '8px', color: '#F4F4F5', fontSize: '12px' }}
        >
          Language
        </Label>
        <Select
          value={settings.language}
          onValueChange={(value) => updateSettings({ language: value })}
        >
          <SelectTrigger
            id="language"
            className="w-full bg-[#141723] text-[#F4F4F5] border-none rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F4F4F5] transition-all duration-200"
            style={{ fontFamily: 'inherit', fontSize: '12px' }}
          >
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-[#141723] text-[#F4F4F5] border-[#141723]">
            <SelectItem value="English" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
              English
            </SelectItem>
            <SelectItem value="Myanmar" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
              Myanmar
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Label style={{ display: 'block', marginBottom: '8px', color: '#F4F4F5', fontSize: '12px' }}>
          Test Mode
        </Label>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <Button
            onClick={() => updateSettings({ testMode: 'wordBased' })}
            className={`flex-1 px-4 py-2 rounded-md border-none transition-all duration-200 ${
              settings.testMode === 'wordBased'
                ? 'bg-[#141723] text-[#F4F4F5]'
                : 'bg-[#0E0F15] text-[#777C90]'
            } hover:bg-[#141723] hover:text-[#F4F4F5] hover:shadow-[0_0_8px_rgba(244,244,245,0.3)]`}
            style={{ fontFamily: 'inherit', fontSize: '12px' }}
          >
            Word Based
          </Button>
          <Button
            onClick={() => updateSettings({ testMode: 'timeBased' })}
            className={`flex-1 px-4 py-2 rounded-md border-none transition-all duration-200 ${
              settings.testMode === 'timeBased'
                ? 'bg-[#141723] text-[#F4F4F5]'
                : 'bg-[#0E0F15] text-[#777C90]'
            } hover:bg-[#141723] hover:text-[#F4F4F5] hover:shadow-[0_0_8px_rgba(244,244,245,0.3)]`}
            style={{ fontFamily: 'inherit', fontSize: '12px' }}
          >
            Time Based
          </Button>
        </div>
        {settings.testMode === 'wordBased' ? (
          <Select
            value={settings.wordCount.toString()}
            onValueChange={(value) => updateSettings({ wordCount: Number(value) })}
          >
            <SelectTrigger
              className="w-full bg-[#141723] text-[#F4F4F5] border-none rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F4F4F5] transition-all duration-200"
              style={{ fontFamily: 'inherit', fontSize: '12px' }}
            >
              <SelectValue placeholder="Select word count" />
            </SelectTrigger>
            <SelectContent className="bg-[#141723] text-[#F4F4F5] border-[#141723]">
              <SelectItem value="30" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                30 Words
              </SelectItem>
              <SelectItem value="60" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                60 Words
              </SelectItem>
              <SelectItem value="120" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                120 Words
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={settings.timeDuration.toString()}
            onValueChange={(value) => updateSettings({ timeDuration: Number(value) })}
          >
            <SelectTrigger
              className="w-full bg-[#141723] text-[#F4F4F5] border-none rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F4F4F5] transition-all duration-200"
              style={{ fontFamily: 'inherit', fontSize: '12px' }}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent className="bg-[#141723] text-[#F4F4F5] border-[#141723]">
              <SelectItem value="15" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                15s
              </SelectItem>
              <SelectItem value="30" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                30s
              </SelectItem>
              <SelectItem value="60" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                60s
              </SelectItem>
              <SelectItem value="120" className="hover:bg-[#0E0F15] focus:bg-[#0E0F15] font-mono text-sm">
                120s
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full px-4 py-3 rounded-md bg-[#141723] text-[#F4F4F5] border-none hover:bg-[#141723]/80 hover:shadow-[0_0_12px_rgba(244,244,245,0.4)] transition-all duration-300"
            style={{ fontFamily: 'inherit', fontSize: '14px', letterSpacing: '1px' }}
          >
            Send Invitation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0E0F15] text-[#F4F4F5] border-[#141723] font-mono">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: '16px', textShadow: '0 0 5px #F4F4F5' }}>
              Confirm Invitation
            </AlertDialogTitle>
            <div style={{ color: '#F4F4F5', fontSize: '12px' }}>
              Send a competition invite to <strong>{username}</strong> with the following settings?
              <ul style={{ marginTop: '8px', listStyle: 'none', padding: 0 }}>
                <li>Language: {settings.language}</li>
                <li>Test Mode: {settings.testMode === 'wordBased' ? 'Word Based' : 'Time Based'}</li>
                {settings.testMode === 'wordBased' ? (
                  <li>Word Count: {settings.wordCount}</li>
                ) : (
                  <li>Duration: {settings.timeDuration}s</li>
                )}
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-[#0E0F15] text-[#F4F4F5] border-[#141723] hover:bg-[#141723] hover:text-[#F4F4F5] font-mono"
              style={{ fontSize: '12px' }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-[#141723] text-[#F4F4F5] hover:bg-[#141723]/80 hover:shadow-[0_0_8px_rgba(244,244,245,0.3)] font-mono"
              style={{ fontSize: '12px' }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompeteForm;