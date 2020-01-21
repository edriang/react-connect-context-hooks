import React from 'react';
import classnames from 'classnames';

import { withMain } from '../provider';
import { MainState } from '../provider/mainReducer';

type LinkProps = {
  active: boolean;
  children: React.ReactNode;
  setVisibilityFilter: () => void;
  filter: string;
}

const Link: React.FC<LinkProps> = ({ active, children, setVisibilityFilter }) => (
  <a
    className={classnames({ selected: active })}
    style={{ cursor: 'pointer' }}
    onClick={() => setVisibilityFilter()}
  >
    {children}
  </a>
)

export default withMain(Link, {
  stateSelectors: {
    active: ({ visibilityFilter }: MainState, props: any) => props.filter === visibilityFilter,
  },
  actionSelectors: {
    setVisibilityFilter: ({ setVisibilityFilter }: any, props: any) => () => setVisibilityFilter(props.filter),
  },
});

export {
  Link,
};
