import { useCounter } from './store';

export default () => {
    const { count } = useCounter({
      stateSelectors: ['count'],
    });
  
    console.info(`Count is: ${count}`);
}
