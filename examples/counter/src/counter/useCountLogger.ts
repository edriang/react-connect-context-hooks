import { useCounter } from './provider';

export default () => {
    const { count } = useCounter({
      stateSelectors: ['count'],
    });
  
    console.warn(`Count is: ${count}`);
}
