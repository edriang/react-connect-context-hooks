import parse from './parsePath';

function parseSelectors(selector: any) {
    if (selector instanceof Array) {
        return selector.reduce((object, current) => {
            const [keyOnStore, mappedKey] = current.split(':');
            const lastDotPosition = keyOnStore.lastIndexOf('.');

            const getter = parse(keyOnStore);

            object[mappedKey || keyOnStore.slice(lastDotPosition + 1)] = getter;

            return object;
        }, {});
    } else if (typeof selector === 'object') {
        const parsedSelector = {};

        Object.entries(selector).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const getter = parse(value);
                
                parsedSelector[key] = getter;
            } else {
                parsedSelector[key] = value;
            }
        });
        return parsedSelector;
    }
    return selector;
}

function executeParsedSelectors(parsedSelectors: any, data: any, props: any = {}) {
    if (typeof parsedSelectors === 'function') {
        return parsedSelectors(data, props);
    }
    
    const selections = {};

    for (let key in parsedSelectors) {
        selections[key] = parsedSelectors[key](data, props);
    }

    return selections;
}

export default parseSelectors;
export {
    executeParsedSelectors,
}
