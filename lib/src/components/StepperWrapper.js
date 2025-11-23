// lib/src/components/StepperWrapper.js
import { useState, useCallback } from "react";
import { useFormManager } from "../useFormManager";

function StepperWrapper({
  steps = [],
  validatePerStep = false,
  children
}) {
  const { validate, errors } = useFormManager();
  const [current, setCurrent] = useState(0);

  const currentStep = steps[current] || null;

  const next = useCallback(async () => {
    if (validatePerStep) {
      const result = await validate(currentStep.fields || []);
      if (!result.ok) return false;
    }
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
    return true;
  }, [currentStep, steps.length, validatePerStep, validate]);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  const goTo = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      setCurrent(index);
    }
  }, [steps.length]);

  const api = {
    current,
    step: currentStep,
    totalSteps: steps.length,
    next,
    prev,
    goTo,
    errors,
  };

  // Render-prop: UI totalmente libre
  return typeof children === "function"
    ? children(api)
    : null;
}

export default StepperWrapper;
