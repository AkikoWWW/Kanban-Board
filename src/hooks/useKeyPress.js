import { useEffect } from 'react';

const useKeyPress = (key, handler, useCtrl = false) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      const isKeyMatch = e.key.toLowerCase() === key.toLowerCase();
      const isCtrlMatch = useCtrl ? (e.ctrlKey || e.metaKey) : true;

      if (isKeyMatch && isCtrlMatch) {
        if (useCtrl) e.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, handler, useCtrl]);
};

export default useKeyPress;