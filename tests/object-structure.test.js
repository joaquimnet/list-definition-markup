const parser = require('../src/parser');

describe('Final Object Structure', () => {
  test('1 line', () => {
    const text = `sample text`;
    expect(parser(text)).toEqual({ 'sample text': 'sample text' });
  });

  test('multiple lines, no children', () => {
    const text = `sample line\nanother line\nyet another line`;
    expect(parser(text)).toEqual({
      'sample line': 'sample line',
      'another line': 'another line',
      'yet another line': 'yet another line',
    });
  });

  test('good indentation, multiple lines, with children', () => {
    const text = `sample line\n  another line\n  yet another line`;
    expect(parser(text)).toEqual({
      'sample line': {
        'another line': 'another line',
        'yet another line': 'yet another line',
      },
    });
  });

  test('good indentation, multiple lines, with multiple children', () => {
    const text = `sample line\n  another line\n  yet another line\nanother\n  good\n  child`;
    expect(parser(text)).toEqual({
      'sample line': {
        'another line': 'another line',
        'yet another line': 'yet another line',
      },
      another: {
        good: 'good',
        child: 'child',
      },
    });
  });

  test('good indentation, multiple lines, with multiple children with children', () => {
    const text = `sample line\n  another line\n  yet another line\nanother\n  good\n  child\n    deep\n      deeper`;
    expect(parser(text)).toEqual({
      'sample line': {
        'another line': 'another line',
        'yet another line': 'yet another line',
      },
      another: {
        good: 'good',
        child: {
          deep: {
            deeper: 'deeper',
          },
        },
      },
    });
  });
});
