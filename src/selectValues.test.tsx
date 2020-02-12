import selectValues from './selectValues';

const mockedState = {
    count: 1,

    user: {
        name: 'Jhon',
    },
}

const mockedProps = {
    lastName: 'Doe',
};

describe('selectValues', () => {
    describe('selectFromArray', () => {
        it('selects keys from data using array', () => {
            const selection = ['count', 'user'];

            const result = selectValues(selection, mockedState);

            expect(result.count).toBe(mockedState.count);
            expect(result.user).toBe(mockedState.user);
        });

        it('selects keys from data using array and assign to given key', () => {
            const selection = ['count:counter'];

            const result = selectValues(selection, mockedState);

            expect(result.counter).toBe(mockedState.count);
        });

        it('selects path from data using array and assign to given key', () => {
            const selection = ['user.name:userName'];

            const result = selectValues(selection, mockedState);

            expect(result.userName).toBe(mockedState.user.name);
        });

        it('selects path from data using array and without mappedKey', () => {
            const selection = ['user.name'];

            const result = selectValues(selection, mockedState);

            expect(result.name).toBe(mockedState.user.name);
        });
    });

    describe('selectFromObject', () => {
        it('selects keys from data using object', () => {
            const selection = {
                count: 'count',
                user: 'user',
            };

            const result = selectValues(selection, mockedState);

            expect(result.count).toBe(mockedState.count);
            expect(result.user).toBe(mockedState.user);
        });

        it('selects keys from data and assign to given key', () => {
            const selection = {
                counter: 'count',
            };

            const result = selectValues(selection, mockedState);

            expect(result.counter).toBe(mockedState.count);
        });

        it('selects path from data and assign to given key', () => {
            const selection = {
                userName: 'user.name',
            };

            const result = selectValues(selection, mockedState);

            expect(result.userName).toBe(mockedState.user.name);
        });

        it('selects value using function and assign to given key', () => {
            const selection = {
                userName: (state: any) => state.user.name,
            };

            const result = selectValues(selection, mockedState);

            expect(result.userName).toBe(mockedState.user.name);
        });

        it('selects value and props using function and assign to given key', () => {
            const selection = {
                fullName: (state: any, props: any) => `${state.user.name} ${props.lastName}`,
            };

            const result = selectValues(selection, mockedState, mockedProps);

            expect(result.fullName).toBe(`${mockedState.user.name} ${mockedProps.lastName}`);
        });
    });

    describe('selectFromFunction', () => {
        it('selects keys using function which returns selected data', () => {
            const selection = (state: any) => {
                return {
                    counter: state.count,
                    userName: state.user.name,
                };
            };

            const result = selectValues(selection, mockedState);

            expect(result.counter).toBe(mockedState.count);
            expect(result.userName).toBe(mockedState.user.name);
        });

        it('selects keys using function which returns selected data and have access to props', () => {
            const selection = (state: any, props: any) => {
                return {
                    fullName: `${state.user.name} ${props.lastName}`,
                };
            };

            const result = selectValues(selection, mockedState, mockedProps);

            expect(result.fullName).toBe(`${mockedState.user.name} ${mockedProps.lastName}`);
        });
    });
});
