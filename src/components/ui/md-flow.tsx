"use client";
import React, { useState, useEffect } from "react";
import { parseInlineContent, renderLink, renderTable } from "../blocks/table-block";
import { DefaultErrorUI } from "../error/file-not-found";
import { CodeBlock } from "../blocks/code-block";
import { MDFlowProps } from "../interface/MDFlowProps";

export const MDFlow: React.FC<MDFlowProps> = ({
  file,
  text: initialText,
  theme: userTheme,
  containerStyle,
  errorFileNotFound,
  errorToShow,
  width = "50%",
  align = "center",
}) => {
  const [content, setContent] = useState<string | null>(initialText || null);
  const [error, setError] = useState<boolean>(false);

  const theme = { ...defaultTheme, ...userTheme };
  const { textStyle, headingStyle } = getStyles(theme);
  useEffect(() => {
    if (file) {
      if (!file.endsWith(".md")) {
        setError(true);
        return;
      }

      fetch(file)
        .then((res) => {
          if (!res.ok) {
            throw new Error("File not found");
          }
          return res.text();
        })
        .then((data) => {
          if (data.trim().startsWith("<!DOCTYPE html>")) {
            throw new Error("Received HTML instead of Markdown");
          }
          setContent(data);
          setError(false);
        })
        .catch((err) => {
          console.error("MDFlow Error:", err);
          setError(true);
        });
    }
  }, [file]);

  if (error || (!content && !file)) {
    return (
      <>
        {errorFileNotFound ? (
          errorFileNotFound
        ) : (
          <DefaultErrorUI message={errorToShow} />
        )}
      </>
    );
  }

  const parseMarkdown = (raw: string) => {
    const lines = raw.trim().split(/\r?\n/);
    const renderedElements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed && !line.includes("<br")) continue;

      if (trimmed.startsWith("---")) {
        renderedElements.push(
          <hr
            key={`hr-${i}`}
            style={{
              border: "none",
              borderTop: "1px solid #eaeaea",
              margin: "2rem 0",
            }}
          />,
        );
        continue;
      }

      if (
        trimmed.startsWith("<div") ||
        trimmed.startsWith("</div") ||
        trimmed.startsWith("<br") ||
        trimmed.startsWith("<hr")
      ) {
        renderedElements.push(
          <div key={i} dangerouslySetInnerHTML={{ __html: trimmed }} />,
        );
        continue;
      }
      if (
        trimmed.startsWith("<div") ||
        trimmed.startsWith("<a") ||
        trimmed.startsWith("<h")
      ) {
        continue;
      }
      if (trimmed.startsWith("```")) {
        const language = trimmed.slice(3) || "text";
        let codeContent = "";
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeContent += lines[i] + "\n";
          i++;
        }
        renderedElements.push(
          <pre
            key={i}
            style={{
              backgroundColor: theme.codeBackground,
              padding: "1rem",
              borderRadius: theme.tableCurve,
              overflowX: "auto",
              border: "1px solid #ddd",
            }}
          >
            <code style={{ fontFamily: "monospace", color: "#d63384" }}>
              {codeContent}
            </code>
          </pre>,
        );
        continue;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const listItems = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
        ) {
          const rawContent = lines[i].trim().slice(2);
          listItems.push(
            <li
              key={i}
              style={{
                marginBottom: "8px",
                listStyleType: "disc",
                display: "list-item",
              }}
            >
              {parseInlineContent(rawContent, theme)}
            </li>,
          );
          i++;
        }
        renderedElements.push(
          <ul
            key={i}
            style={{
              ...textStyle,
              paddingLeft: "2rem",
              margin: "1rem 0",
              listStylePosition: "outside",
            }}
          >
            {listItems}
          </ul>,
        );
        i--;
        continue;
      }
     if (/^\d+\./.test(trimmed)) {
        const listItems = [];
        while (i < lines.length && (/^\d+\./.test(lines[i].trim()) || lines[i].startsWith("   ") || lines[i].startsWith("\t"))) {
          const currentTrimmed = lines[i].trim();
          
          if (currentTrimmed.startsWith("```")) {
            let innerCode = "";
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
              innerCode += lines[i] + "\n";
              i++;
            }
            listItems.push(<CodeBlock key={`inner-${i}`} code={innerCode} theme={theme} />);
          } else if (currentTrimmed !== "") {
            const content = currentTrimmed.replace(/^\d+\.\s+/, "");
            listItems.push(
              <li key={i} style={{ marginBottom: "8px", display: "list-item", listStyleType: "decimal" }}>
                {parseInlineContent(content, theme)}
              </li>
            );
          }
          i++;
        }
        renderedElements.push(
          <ol key={`ol-${i}`} style={{ ...textStyle, paddingLeft: "2.5rem", margin: "1rem 0" }}>
            {listItems}
          </ol>
        );
        i--; continue;
      }

      if (trimmed === "") {
        renderedElements.push(
          <div key={`space-${i}`} style={{ height: "1em" }} />,
        );
        continue;
      }

      if (trimmed.startsWith("|") && lines[i + 1]?.includes("---")) {
        renderedElements.push(renderTable(lines, i, theme));

        while (i < lines.length && lines[i].trim().startsWith("|")) {
          i++;
        }
        i--;
        continue;
      }

      if (trimmed.startsWith("# ")) {
        renderedElements.push(
          <h1 key={i} style={headingStyle(1)}>
            {trimmed.slice(2)}
          </h1>,
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        renderedElements.push(
          <h2 key={i} style={headingStyle(2)}>
            {trimmed.slice(3)}
          </h2>,
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        renderedElements.push(
          <h3 key={i} style={headingStyle(3)}>
            {trimmed.slice(4)}
          </h3>,
        );
        continue;
      }

      const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const [_, alt, src] = imgMatch;
        const isVideo =
          src.toLowerCase().endsWith(".mp4") ||
          src.toLowerCase().endsWith(".webm");

        renderedElements.push(
          isVideo ? (
            <video key={i} src={src} controls style={mediaStyle} />
          ) : (
            <img
              key={i}
              src={src}
              alt={alt}
              style={mediaStyle}
              onClick={() =>
                theme?.showFileEnlarged && window.open(src, "_blank")
              }
            />
          ),
        );
        continue;
      }

      if (trimmed.match(/\[(.*?)\]\((.*?)\)/)) {
        renderedElements.push(renderLink(trimmed, i, theme, textStyle));
        continue;
      }
      if (trimmed.startsWith("```")) {
        let codeContent = "";
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeContent += lines[i] + "\n";
          i++;
        }
        renderedElements.push(<CodeBlock key={i} code={codeContent} theme={theme} />);
        continue;
      }

      renderedElements.push(
        <p key={i} style={textStyle}>
          {parseInlineContent(line, theme)} {/* FIXED HERE */}
        </p>,
      );
    }

    return renderedElements;
  };

  const mediaStyle: React.CSSProperties = {
    borderRadius: theme?.tableCurve || "0px",
    padding: theme?.tablePadding || "0px",
    maxWidth: "100%",
    cursor: theme?.showFileEnlarged ? "zoom-in" : "default",
  };

  const getAlignmentStyles = (align: string): React.CSSProperties => {
    switch (align) {
      case "center":
        return { marginLeft: "auto", marginRight: "auto" };
      case "right":
        return { marginLeft: "auto", marginRight: "0" };
      case "left":
      default:
        return { marginLeft: "0", marginRight: "auto" };
    }
  };

  const alignmentStyle: React.CSSProperties = {
    width: width,
    ...getAlignmentStyles(align),
    backgroundColor: theme?.backgroundColor || "transparent",
    padding: containerStyle?.padding || "20px",
    textAlign: "left", 
    boxSizing: "border-box", 
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={alignmentStyle}>{content && parseMarkdown(content)}</div>
    </div>
  );
};
const defaultTheme = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "16px",
  fontWeight: "400",
  headingColor: "#111",
  subHeading1Color: "#222",
  subHeading2Color: "#444",
  backgroundColor: "transparent",
  tableGap: "0px",
  tablePadding: "12px",
  tableCurve: "8px",
  linkColor: "#0070f3",
  codeBackground: "#f4f4f4",
};

const getStyles = (theme: any) => ({
  textStyle: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    lineHeight: "1.6",
    color: "inherit",
  },
  headingStyle: (level: number): React.CSSProperties => ({
    fontFamily: theme.fontFamily,
    fontWeight: "700",
    marginTop: "1.5rem",
    marginBottom: "1rem",
    color:
      level === 1
        ? theme.headingColor
        : level === 2
          ? theme.subHeading1Color
          : theme.subHeading2Color,
    fontSize: level === 1 ? "2.25rem" : level === 2 ? "1.75rem" : "1.25rem",
    borderBottom: level <= 2 ? "1px solid #eaeaea" : "none",
    paddingBottom: level <= 2 ? "0.3rem" : "0",
  }),
});
