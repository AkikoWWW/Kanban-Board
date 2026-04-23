import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask, onDeleteColumn, onUpdateColumn }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'Column', column },
  });

  const handleTitleSubmit = () => {
    onUpdateColumn(column.id, title);
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} className="column">
      <div className="column-header">
        {isDeleting ? (
          <div className="inline-confirm">
            <span>Delete?</span>
            <button className="confirm-btn yes" onClick={(e) => { e.stopPropagation(); onDeleteColumn(column.id); }}>✓</button>
            <button className="confirm-btn no" onClick={(e) => { e.stopPropagation(); setIsDeleting(false); }}>✕</button>
          </div>
        ) : (
          <>
            <div className="column-title">
              <span className="count-badge">{tasks.length}</span>
              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  autoFocus
                />
              ) : (
                <h3 onClick={() => setIsEditing(true)}>{column.title}</h3>
              )}
            </div>
            <button className="delete-col-btn" onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </>
        )}
      </div>
      
      <div className="column-content">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>

      <button className="add-task-btn" onClick={() => onAddTask(column.id)}>
        + Create Task
      </button>
    </div>
  );
}