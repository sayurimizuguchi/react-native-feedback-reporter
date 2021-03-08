import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

export const GlobalProps = createContext<
  IFeedbackReporterProps & { isModalOpen: boolean }
>({
  isModalOpen: false,
});
