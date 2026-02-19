import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function TaskModal({ isOpen, onClose, onSubmit, defaultValues }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      deadline: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({ title: '', description: '', priority: 'Medium', deadline: '', tags: '' });
      }
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    let tagsArray = [];
    if (typeof data.tags === 'string') {
      tagsArray = data.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    } else {
      tagsArray = data.tags;
    }
    onSubmit({ ...data, tags: tagsArray });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{defaultValues ? 'Edit Task' : 'New Task'}</h2>
        
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="form-group">
            <label>Title</label>
            <input
              {...register('title', { required: true })}
              className="form-control"
              placeholder="Enter task title..."
              autoFocus
            />
            {errors.title && <span style={{color: '#ef4444', fontSize: '12px'}}>Title is required</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register('description')}
              className="form-control"
              placeholder="Add details..."
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select {...register('priority')} className="form-control">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input 
              type="date" 
              {...register('deadline')} 
              className="form-control" 
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input 
              {...register('tags')} 
              className="form-control" 
              placeholder="dev, design, bug" 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {defaultValues ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}