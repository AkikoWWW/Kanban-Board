import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isPast, parseISO, isValid } from 'date-fns';

export default function TaskCard({ task, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.deadline && isValid(parseISO(task.deadline)) && isPast(parseISO(task.deadline)) && !isPast(parseISO(task.deadline).setHours(23, 59, 59));
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isOverdue ? 'overdue' : ''}`}
    >
      <div className="task-top">
        <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
        
        <div className="task-actions-btn">
          {isDeleting ? (
            <div className="inline-confirm-mini">
              <button 
                className="confirm-btn yes mini" 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              >
                ✓
              </button>
              <button 
                className="confirm-btn no mini" 
                onClick={(e) => { e.stopPropagation(); setIsDeleting(false); }}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <button 
                className="btn-icon btn-edit" 
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button 
                className="btn-icon btn-delete" 
                onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="task-title">{task.title}</div>
      
      <div className="task-footer">
        <div className="task-tags">
          {task.tags?.map((tag, idx) => (
            <span key={idx} className="tag">#{tag}</span>
          ))}
        </div>
        {task.deadline && (
          <div className="task-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {task.deadline}
          </div>
        )}
      </div>
    </div>
  );
}