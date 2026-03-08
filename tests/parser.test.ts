
import { describe, it, expect } from 'vitest';
import { mdFlow } from '../src/index';

describe('MDFlow Basic Parsing', () => {
  it('should convert headers correctly', () => {
    const input = '# Hello World';
    const output = '<h1>Hello World</h1>';
    expect(mdFlow(input)).toBe(output);
  });

  it('should convert blockquotes', () => {
    const input = '> This is a quote';
    const output = '<blockquote>This is a quote</blockquote>';
    expect(mdFlow(input)).toBe(output);
  });

  it('should handle multiple lines', () => {
    const input = '# Header\n> Quote';
    const output = '<h1>Header</h1>\n<blockquote>Quote</blockquote>';
    expect(mdFlow(input)).toBe(output);
  });
});