import React from 'react';
import { Button } from 'semantic-ui-react';
import { FormFieldWrapper } from '@plone/volto/components';
import cx from 'classnames';
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
          <Button
            key={opt.value}
            id={id + opt.value}
            className={cx('radio-button', { selected: opt.value === value })}
            disabled={opt.value === value}
            size="mini"
            onClick={(e) => {
              e.preventDefault();
              onChange(id, opt.value);
            }}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </FormFieldWrapper>
  );
};

export default RadioWidget;
