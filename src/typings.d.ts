export type KeyValue = {
    [key: string]: any;
}

export type KeyValueMap = {
    [key: string]: string | ((state: KeyValue, props?: KeyValue) => any);
}

export type Action = (dispatch: React.Dispatch<any>, state?: KeyValue) => Function;

export type ActionCreators = {
    [key: string]: Action;
};

export type CustomProvider = React.ComponentType<any> | React.FC<any>;

export type CreateContextProviderReturn = [
    CustomProvider,
    React.Context<any>
]

export type SelectorFunction = (state: KeyValue, props?: KeyValue) => KeyValue;

export type Selector = string[] | KeyValueMap | SelectorFunction;

export type AfterMergeCallback = (mergedProps: KeyValue) => KeyValue;

export type ComputedSelector = [
    (...args: any) => any,
    string[],
];

export type ComputedSelectors = {
    [key: string]: ComputedSelector;
}

export type ConnectContextOptions = {
    stateSelectors?: Selector;
    actionSelectors?: Selector;
    computedSelectors?: ComputedSelectors;

    stateMappers?: Selector;
    actionMappers?: Selector;
    afterMerge?: AfterMergeCallback;
}

export type ConnectContextFactory = (Component: React.ComponentType<any> | React.FC<any>, options: ConnectContextOptions) => React.FunctionComponent;
