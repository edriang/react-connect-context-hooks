export type KeyValue = {
    [key: string]: any;
}

export type KeyValueMap = {
    [key: string]: string | ((state: KeyValue, props?: KeyValue) => any);
}

export type Action = (dispatch: React.Dispatch<any>) => Function;

export type ActionCreators = {
    [key: string]: Action;
};

export type CreateContextProviderReturn = [
    React.ComponentType<any> | React.FC<any>,
    React.Context<any>
]

export type SelectorFunction = (state: KeyValue, props?: KeyValue) => KeyValue;

export type Selector = string[] | KeyValueMap | SelectorFunction;

export type AfterMergeCallback = (mergedProps: KeyValue) => KeyValue;

export type ConnectContextOptions = {
    stateSelectors?: Selector;
    actionSelectors?: Selector;
    stateMappers?: Selector;
    actionMappers?: Selector;
    afterMerge?: AfterMergeCallback;
}

export type ConenctContextFactory = (Component: React.ComponentType<any> | React.FC<any>, options: ConnectContextOptions) => React.FunctionComponent;
