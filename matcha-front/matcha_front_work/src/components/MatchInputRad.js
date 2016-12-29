import React from 'react';

export default ({ labelClassName, onClick, name, value, required, checked, id, content }) =>
  <div className="style">
    <div className="style">
      <input
        className="radio"
        type="radio"
        id={id}
        name={name}
        required={required}
        value={value}
        checked={checked}
        onClick={onClick}
      />
      <label className={labelClassName} htmlFor={id}>{content}</label>
    </div>
  </div>;
