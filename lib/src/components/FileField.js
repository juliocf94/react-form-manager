// lib/src/components/FileField.js
import React, { useCallback } from 'react';
import { useFormManager } from '../useFormManager';

function FileField({
  name,
  multiple = false,
  accept = "*/*",
  children
}) {
  const { values, setValue, errors, touched } = useFormManager();

  const handleChange = useCallback((e) => {
    const files = e.target.files;
    if (!files) return;
    setValue(name, multiple ? Array.from(files) : files[0]);
  }, [name, multiple, setValue]);

  const fileValue = values[name] || null;
  const error = touched[name] ? errors[name] : null;

  // Render-prop pattern: UI controlled by consumer
  if (typeof children === "function") {
    return children({
      value: fileValue,
      error,
      onChange: handleChange
    });
  }

  // Fallback plain input
  return (
    <div>
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
      />
      {error && <small style={{ color: 'red' }}>{error}</small>}
    </div>
  );
}

export default FileField;
