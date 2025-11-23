// lib/src/useFormManager.js
import { useState, useRef, useEffect, useCallback } from "react";

export default function useFormManager({ initialValues = {}, validationSchema = null, options = {} }) {
  const { validateOnChange = true, validateOnBlur = true, debounceValidate = 250 } = options;

  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const schemaRef = useRef(validationSchema);

  // validate full form
  const validateForm = useCallback(async () => {
    if (!schemaRef.current) {
      setErrors({});
      setIsValid(true);
      return true;
    }
    try {
      await schemaRef.current.validate(values, { abortEarly: false });
      setErrors({});
      setIsValid(true);
      return true;
    } catch (validationError) {
      const formatted = {};
      if (validationError.inner && validationError.inner.length) {
        validationError.inner.forEach(err => {
          if (!formatted[err.path]) formatted[err.path] = err.message;
        });
      } else if (validationError.path) {
        formatted[validationError.path] = validationError.message;
      }
      setErrors(formatted);
      setIsValid(false);
      return false;
    }
  }, [values]);

  // debounced validation on change (simple)
  const validateTimeout = useRef(null);
  useEffect(() => {
    if (!validateOnChange) return;
    if (validateTimeout.current) clearTimeout(validateTimeout.current);
    validateTimeout.current = setTimeout(() => {
      validateForm();
    }, debounceValidate);
    return () => clearTimeout(validateTimeout.current);
  }, [values, validateOnChange, debounceValidate, validateForm]);

  const registerField = useCallback((name, fieldOptions = {}) => {
    // ensures value exists
    setValues(v => (v[name] !== undefined ? v : { ...v, [name]: fieldOptions.default ?? "" }));
    return {
      name,
      value: values[name] ?? (fieldOptions.default ?? ""),
      onChange: e => {
        const next = e && e.target ? (e.target.type === "file" ? e.target.files : e.target.value) : e;
        setValues(prev => ({ ...prev, [name]: next }));
      },
      onBlur: () => {
        setTouched(prev => ({ ...prev, [name]: true }));
        if (validateOnBlur) validateForm();
      }
    };
  }, [values, validateOnBlur, validateForm]);

  const setFieldValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (cb) => {
    setIsSubmitting(true);
    const ok = await validateForm();
    if (!ok) {
      setIsSubmitting(false);
      return { ok:false, errors };
    }
    try {
      await cb(values, { setFieldValue, reset: () => { setValues(initialValues); setErrors({}); setTouched({}); } });
      setIsSubmitting(false);
      return { ok:true };
    } catch (err) {
      setIsSubmitting(false);
      throw err;
    }
  };

  return {
    values, setValues, errors, touched, isSubmitting, isValid,
    registerField, setFieldValue, handleSubmit, validateForm, setErrors, schemaRef
  };
}
