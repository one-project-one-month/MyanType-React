import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ResetButton = ({ onReset }) => {
  return (
    <Button
      onClick={onReset}
      className="bg-[#0e0f15] border-2 border-white hover:border-glow hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] transition-shadow duration-300"
      style={{ padding: '0.75rem 1rem' }}
      title="Reset Test"
    >
      <RefreshCw size={24} />
    </Button>
  );
};

export default ResetButton;