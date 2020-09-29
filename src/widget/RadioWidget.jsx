import React, { useState, useEffect } from 'react';
import { FormFieldWrapper } from '@plone/volto/components';
import './radio_widget.css';

const RadioWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  valueList,
  onChange,
  onEdit,
  onDelete,
  intl,
  fieldSet,
  wrapped,
}) => {
  const [activeRadio, setActiveRadio] = useState(value ?? valueList[0]?.value);

  useEffect(() => {
    if (value !== activeRadio) {
      setActiveRadio(value);
    }
  }, [value]);

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required || null}
      error={error}
      fieldSet={fieldSet}
      wrapped={wrapped}
    >
      <div className="radio-widget">
        {valueList.map((opt) => (
          <div className="radio-button" key={opt.value}>
            <input
              type="radio"
              name={id}
              id={id + opt.value}
              value={opt.value}
              checked={opt.value === activeRadio}
              onChange={(e) => {
                setActiveRadio(e.target.value);
                onChange(id, e.target.value);
              }}
            />
            <label htmlFor={id + opt.value}>{opt.label}</label>
          </div>
        ))}
      </div>
    </FormFieldWrapper>
  );
};

export default RadioWidget;
