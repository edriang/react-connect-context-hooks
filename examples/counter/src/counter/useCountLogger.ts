import { useCounter } from './provider';

export default () => {
    const { count } = useCounter({
      stateSelectors: ['count'],
    });
  
    console.info(`Count is: ${count}`);
}
