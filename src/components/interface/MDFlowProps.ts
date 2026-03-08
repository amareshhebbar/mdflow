export interface MDFlowProps {
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