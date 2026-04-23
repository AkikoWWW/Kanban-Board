import { useEffect } from 'react';

const useKeyPress = (key, handler) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === key) {
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, handler]);
};

export default useKeyPress;