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

        if (lastDotPosition === -1) {
            selectionMap[mappedKey || keyOnStore] = data[keyOnStore];
        } else {
            selectionMap[mappedKey || keyOnStore.slice(lastDotPosition + 1)] = get(data, keyOnStore);
        }
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
    })

    return selectionMap;
}

function get(obj: Object, path: string, def?: any) {
    const fullPath = path
        .replace(/\[/g, '.')
        .replace(/]/g, '')
        .split('.')
        .filter(Boolean)
  
    return fullPath.every(everyFunc) ? obj : def
  
    function everyFunc (step: string) {
        return !(step && (obj = obj[step]) === undefined)
    }
  }

export default selectValues;