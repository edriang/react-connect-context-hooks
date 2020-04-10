import { ContextType } from 'react';

import connectContext, { connectContextFactory, useConnectedContextFactory, mergedConnectContextFactory, useMergedConnectedContextFactory } from './connectContext';
import createContextProvider from './createContextProvider';
import createMergedStore from './createMergedStore';
import { createMockProvider } from './testUtils';

export default createContextProvider;
export {
  connectContext,
  connectContextFactory,
  useConnectedContextFactory,
  mergedConnectContextFactory,
  useMergedConnectedContextFactory,
  createMergedStore,
  ContextType,
  createMockProvider,
};
