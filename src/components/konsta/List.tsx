// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { cls } from './cls.js';
import { ListClasses } from './ListClasses.js';
import { useThemeClasses } from './use-theme-classes.js';
import { ListColors } from './ListColors.js';

interface ListProps {
  component?: string;
  className?: string;
  colors?: typeof ListColors;
  margin?: string;
  menuList?: boolean;
  inset?: boolean;
  insetIos?: boolean;
  insetMaterial?: boolean;
  strong?: boolean;
  strongIos?: boolean;
  strongMaterial?: boolean;
  outline?: boolean;
  outlineIos?: boolean;
  outlineMaterial?: boolean;
  ios?: boolean;
  material?: boolean;
  children?: React.ReactNode;
  [key: string]: any; // For the rest of the props
}

const List = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
  const {
    component = 'div',
    className,
    colors: colorsProp,

    margin = 'my-8',
    menuList,

    inset,
    insetIos,
    insetMaterial,
    strong,
    strongIos,
    strongMaterial,
    outline,
    outlineIos,
    outlineMaterial,

    ios,
    material,

    // Children
    children,

    // Rest
    ...rest
  } = props;

  const elRef = useRef(null);

  useImperativeHandle(ref, () => ({
    el: elRef.current,
  }));

  const Component = component;

  const attrs = {
    ...rest,
  };
  const theme = 'ios';
  const themeClasses = useThemeClasses();
  const dark = () => {
    return '';
  };

  const isStrong =
    typeof strong === 'undefined' ? (theme === 'ios' ? strongIos : strongMaterial) : strong;
  const isOutline =
    typeof outline === 'undefined' ? (theme === 'ios' ? outlineIos : outlineMaterial) : outline;
  const isInset =
    typeof inset === 'undefined' ? (theme === 'ios' ? insetIos : insetMaterial) : inset;

  const colors = ListColors(colorsProp, dark);

  const c = themeClasses(
    ListClasses(
      {
        ...props,
        margin,
        inset: isInset,
        strong: isStrong,
        outline: isOutline,
      },
      colors,
      className,
    ),
  );

  const classes = cls(
    c.base,

    isInset && c.inset,

    menuList && c.menuList,

    className,
  );

  return (
    <Component ref={elRef} className={classes} {...attrs}>
      <ul className={c.ul}>{children}</ul>
    </Component>
  );
});

List.displayName = 'List';

export default List;
