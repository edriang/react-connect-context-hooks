import { useCounter } from './provider';

export default () => {
    const { count } = useCounter({
      stateMappers: ['count'],
    });
  
    console.warn(`Count is: ${count}`);
}
