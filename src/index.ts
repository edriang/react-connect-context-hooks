import { ContextType } from 'react';

import connectContext, { connectContextFactory, useConnectedContextFactory } from './connectContext';
import createContextProvider from './createContextProvider';

export default createContextProvider;
export {
  connectContext,
  connectContextFactory,
  useConnectedContextFactory,
  ContextType,
};
