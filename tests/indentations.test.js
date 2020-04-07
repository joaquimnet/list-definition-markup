const parser = require('../src/parser');

describe('Indentation Parsing', () => {
  test('bad indentation, 1 line', () => {
    const text = `  sample text`;
    expect(() => parser(text)).toThrow(SyntaxError);
  });

  test('good indentation, 1 line', () => {
    const text = `sample text`;
    expect(() => parser(text)).not.toThrow();
  });

  test('bad indentation, multiple lines, no children', () => {
    const text = `sample line\n    another line\nyet another line`;
    expect(() => parser(text)).toThrow(SyntaxError);
  });

  test('good indentation, multiple lines, no children', () => {
    const text = `sample line\nanother line\nyet another line`;
    expect(() => parser(text)).not.toThrow();
  });

  test('bad indentation, multiple lines, with children', () => {
    const text = `sample line\n  another line\n      yet another line`;
    expect(() => parser(text)).toThrow(SyntaxError);
  });

  test('good indentation, multiple lines, with children', () => {
    const text = `sample line\n  another line\n  yet another line`;
    expect(() => parser(text)).not.toThrow();
  });

  test('bad indentation, multiple lines, with multiple children', () => {
    const text = `sample line\n  another line\n  yet another line\nanother\n    bad\n  child`;
    expect(() => parser(text)).toThrow(SyntaxError);
  });

  test('good indentation, multiple lines, with multiple children', () => {
    const text = `sample line\n  another line\n  yet another line\nanother\n  good\n  child`;
    expect(() => parser(text)).not.toThrow();
  });
})
