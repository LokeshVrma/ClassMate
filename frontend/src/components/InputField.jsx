import React from 'react';

const InputField = ({ label, type, className, name, value, onChange, placeholder }) => {
  return (
    <div className={className || "input-group"}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
