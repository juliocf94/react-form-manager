// lib/src/components/Field.js
import { useForm } from "../FormManger";

export default function Field({ name, component: Component, fieldOptions = {}, ...rest }) {
  const manager = useForm();
  const registration = manager.registerField(name, fieldOptions);
  const error = manager.errors[name];
  const touched = manager.touched[name];

  // For custom components we pass value, onChange, onBlur
  return (
    <div className="form-field">
      <Component
        name={name}
        value={registration.value}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        error={Boolean(error && touched)}
        helperText={touched && error ? error : rest.helperText}
        {...rest}
      />
    </div>
  );
}
