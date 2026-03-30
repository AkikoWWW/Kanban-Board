import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormField } from './components/FormField';
import { Button } from './components/Button';

export default function TaskModal({ isOpen, onClose, onSubmit, defaultValues }) {
  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      deadline: '',
      tags: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        const formattedValues = {
          ...defaultValues,
          tags: Array.isArray(defaultValues.tags) ? defaultValues.tags.join(', ') : defaultValues.tags
        };
        methods.reset(formattedValues);
      } else {
        methods.reset({ title: '', description: '', priority: 'Medium', deadline: '', tags: '' });
      }
    }
  }, [isOpen, defaultValues, methods]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    const tagsArray = typeof data.tags === 'string' 
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
      : data.tags;
    
    onSubmit({ ...data, tags: tagsArray });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{defaultValues ? 'Edit Task' : 'New Task'}</h2>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onFormSubmit)}>
            <FormField label="Title" name="title" placeholder="Enter task title..." required />
            <FormField label="Description" name="description" type="textarea" placeholder="Add details..." />
            <FormField 
              label="Priority" 
              name="priority" 
              type="select" 
              options={['Low', 'Medium', 'High']} 
            />
            <FormField label="Deadline" name="deadline" type="date" />
            <FormField label="Tags (comma separated)" name="tags" placeholder="dev, design, bug" />

            <div className="modal-actions">
              <Button type="button" variant="cancel" onClick={onClose}>Cancel</Button>
              <Button type="submit">{defaultValues ? 'Save Changes' : 'Create Task'}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}