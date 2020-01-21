import get from 'lodash/get';

import {
    Selector,
    KeyValueMap,
    KeyValue,
} from './typings';

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
        const [key, value] = propName.split(':');

        if (value) {
            selectionMap[key] = get(data, value);
        } else {
            selectionMap[key] = data[key];
        }
    });

    return selectionMap;
}

function selectFromObject(selection: KeyValueMap, data: KeyValue, props: KeyValue): KeyValue {
    const selectionMap: KeyValue = {};

    Object.entries(selection).forEach(([key, value]) => {
        if (typeof value === 'string') {
            selectionMap[key] = get(data, value);
        } else {
            selectionMap[key] = value(data, props);
        }
    })

    return selectionMap;
}

export default selectValues;