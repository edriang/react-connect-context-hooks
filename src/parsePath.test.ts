import parse from './parsePath';

const object = { a: {b: {c: {d: [{}, {e: 'F'}]}}}};
const array = [{}, [{a: 'b'}, ['a']]];

describe('parse', () => {
    describe('object parser', () => {
        it('parses single property', () => {
            const getter = parse('a');
    
            expect(getter(object)).toBe(object.a);
        });
    
        it('allows empty path', () => {
            const getter = parse('');
    
            expect(getter(object)).toBe(object);
        });
    
        it('parses nested properties', () => {
            const getter = parse('a.b.c.d');
    
            expect(getter(object)).toBe(object.a.b.c.d);
        });
    
        it('parses nested property with array', () => {
            const getter = parse('a.b.c.d[1]');
    
            expect(getter(object)).toBe(object.a.b.c.d[1]);
        });
    
        it('parses nested property with array and then object', () => {
            const getter = parse('a.b.c.d[1].e');
    
            expect(getter(object)).toBe(object.a.b.c.d[1].e);
        });
    
        it('parses array with dot notation', () => {
            const getter = parse('a.b.c.d.1.e');
    
            expect(getter(object)).toBe(object.a.b.c.d[1].e);
        });

        it('supports empty content between dots', () => {
            const getter = parse('a..b');
    
            expect(getter(object)).toBe(object.a.b);
        });
    });

    describe('array parser', () => {
        it('parses array', () => {
            const getter = parse('[1]');
    
            expect(getter(array)).toBe(array[1]);
        });

        it('parses nested array', () => {
            const getter = parse('[1][1]');
    
            expect(getter(array)).toBe(array[1][1]);
        });

        it('parses nested array followed by object', () => {
            const getter = parse('[1][0].a');
    
            expect(getter(array)).toBe(array[1][0].a);
        });
    });

    describe('wrong paths', () => {
        it('throws if provided path with non-supported character', () => {
            expect(() => parse('a.b.a!')).toThrow();
        });

        it('throws if provided nested braces', () => {
            expect(() => parse('[[1]]')).toThrow();
        });

        it('throws if close brace is not preceeded by opening brace', () => {
            expect(() => parse('][1]')).toThrow();
        });

        it('throws if opening brace is never closed', () => {
            expect(() => parse('[1')).toThrow();
        });

        it('throws on empty braces content', () => {
            expect(() => parse('[1][]')).toThrow();
        });
    });
});
