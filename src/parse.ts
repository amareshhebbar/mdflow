import { MDFlowOptions } from './types';

export class Parser {
  private options: MDFlowOptions;

  constructor(options: MDFlowOptions = {}) {
    this.options = {
      allowHTML: false,
      gfm: true,
      ...options
    };
  }

  public parse(markdown: string): string {
    let output = markdown;

    output = output.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    output = output.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    output = output.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    output = output.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    return output.trim();
  }
}