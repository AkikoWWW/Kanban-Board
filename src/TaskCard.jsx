import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from './store';
import { Button } from './components/Button';

export default function TaskCard({ task, onEdit, onDelete }) {
  const toggleTaskDone = useStore((state) => state.toggleTaskDone);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDone = task.columnId === 'col-3';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-top">
        <div 
          className="task-check-wrapper" 
          onPointerDown={(e) => e.stopPropagation()}
        >
          <input 
            type="checkbox" 
            checked={isDone} 
            onChange={() => toggleTaskDone(task.id)}
          />
          <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
        </div>
        
        <div className="task-actions-btn" onPointerDown={(e) => e.stopPropagation()}>
          {!isDone && (
            <Button variant="icon" onClick={(e) => { onEdit(task); }}>
                ✎
            </Button>
          )}
          <Button variant="icon" onClick={(e) => { onDelete(task.id); }}>
              🗑
          </Button>
        </div>
      </div>
      
      <div className={`task-title ${isDone ? 'title-done' : ''}`}>
        {task.title}
      </div>
      
      <div className="task-footer">
        <div className="task-tags">
          {task.tags?.map((tag, idx) => (
            <span key={idx} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}