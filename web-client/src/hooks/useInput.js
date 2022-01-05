const { useState, useCallback } = require('react');

function useInputs(initialForm) {
  const [form, setForm] = useState(initialForm);

  const onChange = useCallback(
    (e) => {
      setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
    },
    [setForm],
  );

  const initializeForm = useCallback(
    (...fields) => {
      if (fields.length <= 0) {
        setForm(initialForm);
        return;
      }

      const keys = Object.keys(form);
      const newForm = {};

      for (const key of keys) {
        if (fields.includes(key)) {
          newForm[key] = initialForm[key];
        } else {
          newForm[key] = form[key];
        }
      }

      setForm(newForm);
    },
    [form, initialForm],
  );

  return [form, onChange, initializeForm];
}

export default useInputs;
