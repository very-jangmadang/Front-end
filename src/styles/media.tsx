import { css, type CSSObject, type Interpolation } from 'styled-components';

export type Breakpoints = 'small' | 'medium' | 'large' | 'notLarge';

export const breakpoints: Record<Breakpoints, string> = {
  small: '@media (max-width: 390px)',
  medium: '@media (max-width: 744px)',
  large: '@media (min-width: 745px)',
  notLarge: '@media not all and (min-width: 745px)',
};

const media = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<Object>[]
    ) => css`
      ${value} {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<Breakpoints, any>;

export default media;
