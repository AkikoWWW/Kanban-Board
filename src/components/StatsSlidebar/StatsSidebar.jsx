import React, { useCallback } from 'react';
import { Button } from '../UI/Button';

export default function StatsSidebar({ stats, onClearTasks }) {
  
  const handleClearClick = useCallback(() => {
    if (window.confirm('Delete all tasks and reset stats?')) {
      onClearTasks();
    }
  }, [onClearTasks]);

  return (
    <aside className="stats-sidebar">
      <div className="stats-card">
        <h3>Board Stats</h3>
        
        <div className="stat-item">
          <span className="stat-label">Tasks</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${stats.progress}%` }} 
          />
        </div>
        
        <div className="shortcuts-info" style={{ marginTop: '20px', fontSize: '11px', opacity: 0.6 }}>
          <p>⌨️ <kbd>Ctrl</kbd>+<kbd>I</kbd> New Task</p>
          <p>⌨️ <kbd>T</kbd> Toggle Theme</p>
        </div>
        
        <Button 
          className="btn-danger" 
          onClick={handleClearClick}
        >
          Reset All Tasks
        </Button>
      </div>
    </aside>
  );
}