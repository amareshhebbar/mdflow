import React$1 from 'react';

interface MDFlowOptions {
    allowHTML?: boolean;
    gfm?: boolean;
    headerPrefix?: string;
}
interface MDFlowResult {
    html: string;
    metadata?: Record<string, any>;
}

declare class Parser {
    private options;
    constructor(options?: MDFlowOptions);
    parse(markdown: string): string;
}

interface MDFlowProps {
    file?: string;
    text?: string;
    errorFileNotFound?: React.ReactNode;
    errorToShow?: string;
    width?: string;
    align?: "left" | "center" | "right";
    theme?: {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
        headingColor?: string;
        subHeading1Color?: string;
        subHeading2Color?: string;
        backgroundColor?: string;
        tableGap?: string;
        tablePadding?: string;
        tableCurve?: string;
        tableBottomScroll?: boolean;
        tableVerticalFlow?: boolean;
        linkColor?: string;
        linkUnderline?: boolean;
        linkBold?: boolean;
        mediaBorderRadius?: string;
        showFileEnlarged?: boolean;
    };
    containerStyle?: {
        padding?: string;
        margin?: string;
    };
}

declare const MDFlow: React$1.FC<MDFlowProps>;

declare function mdFlow(markdown: string, options?: MDFlowOptions): string;

export { MDFlow, type MDFlowOptions, type MDFlowProps, type MDFlowResult, Parser, mdFlow };
