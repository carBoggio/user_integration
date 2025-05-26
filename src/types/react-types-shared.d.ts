import type { NavigateOptions } from 'react-router-dom';

declare module '@react-types/shared' {
  export interface RouterConfig {
    routerOptions: NavigateOptions;
  }
} 