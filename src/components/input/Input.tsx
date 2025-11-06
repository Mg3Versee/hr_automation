import classNames from 'classnames';
import _ from 'lodash';
import React, { JSX } from 'react';
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

export interface InputFormFieldProps<TFieldValues extends FieldValues> {
  register?: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  name: FieldPath<TFieldValues>;
}

interface InputProps<TFieldValues extends FieldValues> extends InputFormFieldProps<TFieldValues> {
  label?: string;
  type: string;
  step?: number;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | readonly string[];
  footer?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  hidden?: boolean;
}

export type CommonInputProps<TFieldValues extends FieldValues> = Partial<InputProps<TFieldValues>>;

const Input = <TFieldValues extends FieldValues>({
  label,
  type,
  name,
  register,
  errors,
  step,
  placeholder,
  disabled = false,
  required = false,
  className,
  hidden = false,
  readOnly = false,
  ...props
}: InputProps<TFieldValues>): JSX.Element => {
  const error = _.get(errors, name)?.message as string;

  const inputClasses = classNames('py-2 px-3 w-full border rounded', {
    'opacity-50': disabled,
    [className ?? '']: className
  });

  const errorClasses = classNames('text-red-600 text-sm font-semibold', {
    hidden: !error || hidden
  });

  return (
    <div className="w-full mb-2 text-black">
      <div>
        {label && !hidden && (
          <label htmlFor={String(name)} className="text-sm">
            {label} {required && <span className="text-red-600"> *</span>}
          </label>
        )}

        <div className="w-full">
          <input
            id={String(name)}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            step={step}
            readOnly={readOnly}
            className={inputClasses}
            hidden={hidden}
            {...register?.(name, {
              required,
              disabled,
              valueAsNumber: type === 'number',
              setValueAs: value => value || undefined
            })}
            {...props}
          />
          {props.footer && <div className="text-gray-500 text-xs">{props.footer}</div>}
        </div>
      </div>
      {error && !hidden && <p className={errorClasses}>{error}</p>}
    </div>
  );
};

export default Input;