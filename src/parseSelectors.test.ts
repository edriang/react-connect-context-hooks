import parseSelectors, { executeParsedSelectors } from './parseSelectors';

const state = {
    todos: [{name: 'Test Name'}],
    main: {
        visibilityFilter: 'Test Filter',
    },
    'key:with:colons': 'keyColonValue',
    'key.with.dots': 'keyDotsValue',
}

const arraySelector = ['todos', 'todos[0].name', 'main.visibilityFilter:filter'];
const complexArraySelector = ['[key:with:colons]', '[key:with:colons]:keyWithColons', '[key:with:dots]', '[key:with:dots]:keyWithDots'];
const objectSelector = {
    todos: 'todos',
    name: 'todos[0].name',
    filter: (state: any) => state.main.visibilityFilter,
};
const functionSelector = (state: any) => ({
    todos: state.todos,
    name: state.todos[0].name,
    filter: state.main.visibilityFilter,
});

const expectedOutput = {
    todos: state.todos,
    name: state.todos[0].name,
    filter: state.main.visibilityFilter,
};

const expectedComplexOutput = {
    '[key:with:colons]': state['key:with:colons'],
    keyWithColons: state['key:with:colons'],
    '[key:with:dots]': state['key:with:dots'],
    keyWithDots: state['key:with:dots'],
};

describe('parseSelectors', () => {
    it ('generates parsed selectors from array input', () => {
        const parsedSelectors = parseSelectors(arraySelector);
        const selection = executeParsedSelectors(parsedSelectors, state);

        expect(selection).toEqual(expectedOutput);
    });

    it ('parses non-standard keys from array input', () => {
        const parsedSelectors = parseSelectors(complexArraySelector);
        const selection = executeParsedSelectors(parsedSelectors, state);

        expect(selection).toEqual(expectedComplexOutput);
    });

    it ('generates parsed selectors from object input', () => {
        const parsedSelectors = parseSelectors(objectSelector);
        const selection = executeParsedSelectors(parsedSelectors, state);

        expect(selection).toEqual(expectedOutput);
    });

    it ('generates parsed selectors from function input', () => {
        const parsedSelectors = parseSelectors(functionSelector);
        const selection = executeParsedSelectors(parsedSelectors, state);

        expect(selection).toEqual(expectedOutput);
    });
})