// lib/src/components/SubmitButton.js
import { useForm } from "../FormManger";

export default function SubmitButton({ children, disabledWhenInvalid = true, ...props }) {
    const fm = useForm();
    const disabled = disabledWhenInvalid ? (!fm.isValid || fm.isSubmitting) : fm.isSubmitting;
    return (
        <button type="submit" disabled={disabled} {...props}>
            {fm.isSubmitting ? "Sending..." : children}
        </button>
    );
}
