import parse from './parsePath';

import {
    Selector,
    KeyValueMap,
    KeyValue,
} from './typings';

const gettersMap = new Map();

const selectValues = (selection: Selector = [], data: KeyValue = {}, props: KeyValue = {}) => {
    if (selection instanceof Array) {
        return selectFromArray(selection, data);
    }
    if (typeof selection === 'object') {
        return selectFromObject(selection, data, props);
    }
    if (typeof selection === 'function') {
        return selection(data, props);
    }

    throw 'Selector should be plain object, array or function';
};

function selectFromArray(selection: string[], data: KeyValue = {}): KeyValue {
    const selectionMap: KeyValue = {};

    selection.forEach(propName => {
        const [keyOnStore, mappedKey] = propName.split(':');
        const lastDotPosition = keyOnStore.lastIndexOf('.');

        let getter = gettersMap.get(keyOnStore);

        if (!getter) {
            getter = parse(keyOnStore);
            gettersMap.set(keyOnStore, getter);
        }

        selectionMap[mappedKey || keyOnStore.slice(lastDotPosition + 1)] = getter(data);
    });

    return selectionMap;
}

function selectFromObject(selection: KeyValueMap, data: KeyValue, props: KeyValue): KeyValue {
    const selectionMap: KeyValue = {};

    Object.entries(selection).forEach(([key, value]) => {
        if (typeof value === 'string') {
            let getter = gettersMap.get(value);

            if (!getter) {
                getter = parse(value);
                gettersMap.set(value, getter);
            }
            selectionMap[key] = getter(data);
        } else {
            selectionMap[key] = value(data, props);
        }
    });

    return selectionMap;
}

export default selectValues;