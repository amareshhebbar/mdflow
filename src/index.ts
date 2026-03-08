
import { Parser } from './parse';
import { MDFlowOptions } from './types';
import { MDFlow } from './components/MdFlow';
import { MDFlowProps } from './components/interface/MDFlowProps';

export { MDFlow, Parser };
export type { MDFlowProps, MDFlowOptions };

export * from './types';
export * from './components/interface/MDFlowProps';

export function mdFlow(markdown: string, options?: MDFlowOptions): string {
  const parser = new Parser(options);
  return parser.parse(markdown);
}