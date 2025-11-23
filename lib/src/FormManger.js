// lib/src/FormManager.js
import React from "react";
import useFormManager from "./useFormManger";

const FormContext = React.createContext(null);

export function FormProvider({ children, manager }) {
    return <FormContext.Provider value={manager}>{children}</FormContext.Provider>;
}

export const useForm = () => React.useContext(FormContext);

export function FormManager({ children, initialValues, validationSchema, onSubmit, mode = "create", options }) {
    const manager = useFormManager({ initialValues, validationSchema, options });

    // Provide an API to change schema during runtime if needed
    React.useEffect(() => { manager.schemaRef.current = validationSchema; }, [validationSchema]);

    return (
        <FormProvider manager={manager}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    manager.handleSubmit(onSubmit);
                }}
                noValidate
            >
                {typeof children === "function" ? children(manager) : children}
            </form>
        </FormProvider>
    );
}
