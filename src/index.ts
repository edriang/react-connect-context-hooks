import { ContextType } from 'react';

import connectContext, { connectContextFactory, useConnectedContextFactory, mergedConnectContextFactory } from './connectContext';
import createContextProvider from './createContextProvider';

export default createContextProvider;
export {
  connectContext,
  connectContextFactory,
  useConnectedContextFactory,
  mergedConnectContextFactory,
  ContextType,
};
