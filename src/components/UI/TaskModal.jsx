import React, { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSubmit, defaultValues, columns, targetColumnId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState('');
  const [columnId, setColumnId] = useState('');

  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title || '');
      setDescription(defaultValues.description || '');
      setPriority(defaultValues.priority || 'Medium');
      setDeadline(defaultValues.deadline || '');
      setTags(defaultValues.tags ? defaultValues.tags.join(', ') : '');
      setColumnId(defaultValues.columnId || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
      setTags('');
      setColumnId(targetColumnId || (columns.length > 0 ? columns[0].id : ''));
    }
  }, [defaultValues, targetColumnId, isOpen, columns]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      deadline,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      columnId
    };

    onSubmit(taskData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{defaultValues ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              autoFocus
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter task title..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Add details..."
            />
          </div>
          
          <div className="form-group">
            <label>Priority</label>
            <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input 
              type="date"
              className="form-control" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input 
              className="form-control" 
              value={tags} 
              onChange={e => setTags(e.target.value)} 
              placeholder="dev, design, bug"
            />
          </div>

          {!targetColumnId && !defaultValues && (
            <div className="form-group">
              <label>Section</label>
              <select className="form-control" value={columnId} onChange={e => setColumnId(e.target.value)}>
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {defaultValues ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}