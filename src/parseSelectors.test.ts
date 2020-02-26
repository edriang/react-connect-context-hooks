import parseSelectors, { executeParsedSelectors } from './ignore-parsed-options';

const state = {
    todos: [{name: 'Test Name'}],
    main: {
        visibilityFilter: 'Test Filter',
    },
}

const arraySelector = ['todos', 'todos[0].name', 'main.visibilityFilter:filter'];
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

describe('parseSelectors', () => {
    it ('generates parsed selectors from array input', () => {
        const parsedSelectors = parseSelectors(arraySelector);
        const selection = executeParsedSelectors(parsedSelectors, state);

        expect(selection).toEqual(expectedOutput);
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