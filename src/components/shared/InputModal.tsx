import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/references/unused-components/ui/dialog';
import { Button } from '@/references/unused-components/ui/button';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = '',
  confirmText = 'OK',
  cancelText = 'Batal'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-6 z-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[var(--dark)]">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600 mt-2">
          {message}
        </DialogDescription>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent mt-2"
          autoFocus
        />
        
        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button 
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            variant="default"
            onClick={handleConfirm}
            disabled={!inputValue.trim()}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InputModal;