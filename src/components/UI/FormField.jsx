import React from 'react';
import { useFormContext } from 'react-hook-form';

export const FormField = ({ label, name, type = 'text', options, ...props }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-group">
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea {...register(name)} className="form-control" {...props} />
      ) : type === 'select' ? (
        <select {...register(name)} className="form-control" {...props}>
          {options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...register(name)} className="form-control" {...props} />
      )}
      {errors[name] && <span className="error-msg">{label} is required</span>}
    </div>
  );
};