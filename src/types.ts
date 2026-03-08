
export interface MDFlowOptions {
  allowHTML?: boolean;
  gfm?: boolean; 
  headerPrefix?: string;
}

export interface MDFlowResult {
  html: string;
  metadata?: Record<string, any>;
}