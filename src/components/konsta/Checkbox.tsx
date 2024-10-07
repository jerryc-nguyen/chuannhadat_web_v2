// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { CheckboxClasses } from './CheckboxClasses.js';
import { CheckboxColors } from './CheckboxColors.js';
import { useThemeClasses } from './use-theme-classes.js';

import CheckboxIcon from './icons/CheckboxIcon.jsx';

const Checkbox = forwardRef((props: A, ref: A) => {
  const {
    component = 'label',
    className,
    colors: colorsProp,
    defaultChecked,
    checked,
    indeterminate,
    name,
    value,
    disabled,
    readOnly,
    onChange,
    ios,
    material,
    // Children
    children,
    // Rest
    ...rest
  } = props;

  const inputElRef = useRef(null);
  const elRef = useRef(null);

  useImperativeHandle(ref, () => ({
    el: elRef.current,
    inputEl: inputElRef.current,
  }));

  const Component = component;

  const attrs = {
    ...rest,
  };

  const themeClasses = useThemeClasses();
  const dark = () => {
    return;
  };

  const colors = CheckboxColors(colorsProp, dark);

  const state =
    checked || (defaultChecked && !onChange) || indeterminate ? 'checked' : 'notChecked';

  const c = themeClasses(CheckboxClasses(props, colors, className, dark), className);

  useEffect(() => {
    if (inputElRef.current) {
      inputElRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <Component ref={elRef} className={c.base} {...attrs}>
      <input
        ref={inputElRef}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className={c.input}
      />
      <i className={c.iconWrap[state]}>
        {indeterminate ? (
          <span className={c.indeterminateIcon} />
        ) : (
          <CheckboxIcon ios={ios} material={material} className={c.icon[state]} />
        )}
      </i>
      {children}
    </Component>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
