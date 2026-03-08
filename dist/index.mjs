// src/parse.ts
var Parser = class {
  options;
  constructor(options = {}) {
    this.options = {
      allowHTML: false,
      gfm: true,
      ...options
    };
  }
  parse(markdown) {
    let output = markdown;
    output = output.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");
    output = output.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    output = output.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    output = output.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    return output.trim();
  }
};

// src/components/ui/md-flow.tsx
import { useState, useEffect } from "react";

// src/components/blocks/table-block.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var renderTable = (lines, startIndex, theme) => {
  const rows = [];
  let i = startIndex;
  while (lines[i] && lines[i].trim().startsWith("|")) {
    const line = lines[i].trim();
    if (!line.includes("---")) {
      const cells = line.split("|").map((s) => s.trim()).filter(Boolean);
      rows.push(cells);
    }
    i++;
  }
  return /* @__PURE__ */ jsx("div", { style: { margin: "20px 0", borderRadius: theme.tableCurve, border: "1px solid #eee", overflow: "hidden" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
    /* @__PURE__ */ jsx("thead", { style: { backgroundColor: "#f8f9fa" }, children: /* @__PURE__ */ jsx("tr", { children: rows[0]?.map((col, idx) => /* @__PURE__ */ jsx("th", { style: { padding: theme.tablePadding, textAlign: "left" }, children: parseInlineContent(col, theme) }, idx)) }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.slice(1).map((row, ri) => /* @__PURE__ */ jsx("tr", { children: row.map((cell, ci) => /* @__PURE__ */ jsx("td", { style: { padding: theme.tablePadding, borderBottom: "1px solid #eee" }, children: parseInlineContent(cell, theme) }, ci)) }, ri)) })
  ] }) });
};
var renderLink = (line, index, theme, textStyle) => {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts = line.split(/(\[.*?\]\(.*?\))/g);
  return /* @__PURE__ */ jsx("p", { style: { ...textStyle, margin: "0.5em 0" }, children: parts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match) {
      const [_, linkText, href] = match;
      return /* @__PURE__ */ jsx(
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            color: theme?.linkColor || "#0070f3",
            textDecoration: theme?.showLinkUnderline ? "underline" : "none",
            fontWeight: theme?.showLinkBold ? "bold" : "normal"
          },
          children: linkText
        },
        i
      );
    }
    return /* @__PURE__ */ jsx("span", { children: part }, i);
  }) }, index);
};
var parseInlineContent = (text, theme) => {
  if (!text) return "";
  const combinedRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(combinedRegex);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const innerText = part.slice(2, -2);
      return /* @__PURE__ */ jsx("strong", { children: parseInlineContent(innerText, theme) }, i);
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [_, linkText, href] = linkMatch;
      return /* @__PURE__ */ jsx(
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            color: theme?.linkColor || "#0070f3",
            textDecoration: theme?.showLinkUnderline ? "underline" : "none",
            fontWeight: theme?.showLinkBold ? "bold" : "normal"
          },
          children: linkText
        },
        i
      );
    }
    return /* @__PURE__ */ jsx("span", { children: part }, i);
  });
};

// src/components/error/file-not-found.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var DefaultErrorUI = ({ message }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    border: "2px dashed #e0e0e0",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    color: "#757575",
    textAlign: "center",
    fontFamily: "sans-serif"
  };
  const iconStyle = {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.6
  };
  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    color: "#424242"
  };
  return /* @__PURE__ */ jsxs2("div", { style: containerStyle, children: [
    /* @__PURE__ */ jsx2("div", { style: iconStyle, children: "\u{1F4C4}\u2715" }),
    /* @__PURE__ */ jsx2("h3", { style: titleStyle, children: "Document Not Found" }),
    /* @__PURE__ */ jsx2("p", { style: { margin: 0, fontSize: "14px" }, children: message || "We couldn't load the requested Markdown file." }),
    /* @__PURE__ */ jsx2(
      "button",
      {
        onClick: () => window.location.reload(),
        style: {
          marginTop: "20px",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid #d1d1d1",
          background: "#fff",
          cursor: "pointer",
          fontSize: "12px"
        },
        children: "Retry Connection"
      }
    )
  ] });
};

// src/components/blocks/code-block.tsx
import React from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var CodeBlock = ({ code, theme }) => {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs3("div", { style: { position: "relative", margin: "1.5rem 0" }, children: [
    /* @__PURE__ */ jsx3(
      "button",
      {
        onClick: copyToClipboard,
        style: {
          position: "absolute",
          top: "8px",
          right: "8px",
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: copied ? "#28a745" : "#fff",
          color: copied ? "#fff" : "#333",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10
        },
        children: copied ? "Copied!" : "Copy"
      }
    ),
    /* @__PURE__ */ jsx3(
      "pre",
      {
        style: {
          backgroundColor: theme.codeBackground || "#f4f4f4",
          padding: "0.8rem",
          borderRadius: theme.tableCurve || "8px",
          overflowX: "auto",
          border: "1px solid #eee",
          margin: 0
        },
        children: /* @__PURE__ */ jsx3("code", { style: { fontFamily: "monospace", color: "#fff", fontSize: "14px" }, children: code })
      }
    )
  ] });
};

// src/components/ui/md-flow.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var MDFlow = ({
  file,
  text: initialText,
  theme: userTheme,
  containerStyle,
  errorFileNotFound,
  errorToShow,
  width = "50%",
  align = "center"
}) => {
  const [content, setContent] = useState(initialText || null);
  const [error, setError] = useState(false);
  const theme = { ...defaultTheme, ...userTheme };
  const { textStyle, headingStyle } = getStyles(theme);
  useEffect(() => {
    if (file) {
      if (!file.endsWith(".md")) {
        setError(true);
        return;
      }
      fetch(file).then((res) => {
        if (!res.ok) {
          throw new Error("File not found");
        }
        return res.text();
      }).then((data) => {
        if (data.trim().startsWith("<!DOCTYPE html>")) {
          throw new Error("Received HTML instead of Markdown");
        }
        setContent(data);
        setError(false);
      }).catch((err) => {
        console.error("MDFlow Error:", err);
        setError(true);
      });
    }
  }, [file]);
  if (error || !content && !file) {
    return /* @__PURE__ */ jsx4(Fragment, { children: errorFileNotFound ? errorFileNotFound : /* @__PURE__ */ jsx4(DefaultErrorUI, { message: errorToShow }) });
  }
  const parseMarkdown = (raw) => {
    const lines = raw.trim().split(/\r?\n/);
    const renderedElements = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed && !line.includes("<br")) continue;
      if (trimmed.startsWith("---")) {
        renderedElements.push(
          /* @__PURE__ */ jsx4(
            "hr",
            {
              style: {
                border: "none",
                borderTop: "1px solid #eaeaea",
                margin: "2rem 0"
              }
            },
            `hr-${i}`
          )
        );
        continue;
      }
      if (trimmed.startsWith("<div") || trimmed.startsWith("</div") || trimmed.startsWith("<br") || trimmed.startsWith("<hr")) {
        renderedElements.push(
          /* @__PURE__ */ jsx4("div", { dangerouslySetInnerHTML: { __html: trimmed } }, i)
        );
        continue;
      }
      if (trimmed.startsWith("<div") || trimmed.startsWith("<a") || trimmed.startsWith("<h")) {
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
          /* @__PURE__ */ jsx4(
            "pre",
            {
              style: {
                backgroundColor: theme.codeBackground,
                padding: "1rem",
                borderRadius: theme.tableCurve,
                overflowX: "auto",
                border: "1px solid #ddd"
              },
              children: /* @__PURE__ */ jsx4("code", { style: { fontFamily: "monospace", color: "#d63384" }, children: codeContent })
            },
            i
          )
        );
        continue;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const listItems = [];
        while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
          const rawContent = lines[i].trim().slice(2);
          listItems.push(
            /* @__PURE__ */ jsx4(
              "li",
              {
                style: {
                  marginBottom: "8px",
                  listStyleType: "disc",
                  display: "list-item"
                },
                children: parseInlineContent(rawContent, theme)
              },
              i
            )
          );
          i++;
        }
        renderedElements.push(
          /* @__PURE__ */ jsx4(
            "ul",
            {
              style: {
                ...textStyle,
                paddingLeft: "2rem",
                margin: "1rem 0",
                listStylePosition: "outside"
              },
              children: listItems
            },
            i
          )
        );
        i--;
        continue;
      }
      if (/^\d+\./.test(trimmed)) {
        const listItems = [];
        while (i < lines.length && (/^\d+\./.test(lines[i].trim()) || lines[i].startsWith("   ") || lines[i].startsWith("	"))) {
          const currentTrimmed = lines[i].trim();
          if (currentTrimmed.startsWith("```")) {
            let innerCode = "";
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
              innerCode += lines[i] + "\n";
              i++;
            }
            listItems.push(/* @__PURE__ */ jsx4(CodeBlock, { code: innerCode, theme }, `inner-${i}`));
          } else if (currentTrimmed !== "") {
            const content2 = currentTrimmed.replace(/^\d+\.\s+/, "");
            listItems.push(
              /* @__PURE__ */ jsx4("li", { style: { marginBottom: "8px", display: "list-item", listStyleType: "decimal" }, children: parseInlineContent(content2, theme) }, i)
            );
          }
          i++;
        }
        renderedElements.push(
          /* @__PURE__ */ jsx4("ol", { style: { ...textStyle, paddingLeft: "2.5rem", margin: "1rem 0" }, children: listItems }, `ol-${i}`)
        );
        i--;
        continue;
      }
      if (trimmed === "") {
        renderedElements.push(
          /* @__PURE__ */ jsx4("div", { style: { height: "1em" } }, `space-${i}`)
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
          /* @__PURE__ */ jsx4("h1", { style: headingStyle(1), children: trimmed.slice(2) }, i)
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        renderedElements.push(
          /* @__PURE__ */ jsx4("h2", { style: headingStyle(2), children: trimmed.slice(3) }, i)
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        renderedElements.push(
          /* @__PURE__ */ jsx4("h3", { style: headingStyle(3), children: trimmed.slice(4) }, i)
        );
        continue;
      }
      const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const [_, alt, src] = imgMatch;
        const isVideo = src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm");
        renderedElements.push(
          isVideo ? /* @__PURE__ */ jsx4("video", { src, controls: true, style: mediaStyle }, i) : /* @__PURE__ */ jsx4(
            "img",
            {
              src,
              alt,
              style: mediaStyle,
              onClick: () => theme?.showFileEnlarged && window.open(src, "_blank")
            },
            i
          )
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
        renderedElements.push(/* @__PURE__ */ jsx4(CodeBlock, { code: codeContent, theme }, i));
        continue;
      }
      renderedElements.push(
        /* @__PURE__ */ jsxs4("p", { style: textStyle, children: [
          parseInlineContent(line, theme),
          " "
        ] }, i)
      );
    }
    return renderedElements;
  };
  const mediaStyle = {
    borderRadius: theme?.tableCurve || "0px",
    padding: theme?.tablePadding || "0px",
    maxWidth: "100%",
    cursor: theme?.showFileEnlarged ? "zoom-in" : "default"
  };
  const getAlignmentStyles = (align2) => {
    switch (align2) {
      case "center":
        return { marginLeft: "auto", marginRight: "auto" };
      case "right":
        return { marginLeft: "auto", marginRight: "0" };
      case "left":
      default:
        return { marginLeft: "0", marginRight: "auto" };
    }
  };
  const alignmentStyle = {
    width,
    ...getAlignmentStyles(align),
    backgroundColor: theme?.backgroundColor || "transparent",
    padding: containerStyle?.padding || "20px",
    textAlign: "left",
    boxSizing: "border-box"
  };
  return /* @__PURE__ */ jsx4("div", { style: { width: "100%" }, children: /* @__PURE__ */ jsx4("div", { style: alignmentStyle, children: content && parseMarkdown(content) }) });
};
var defaultTheme = {
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
  codeBackground: "#f4f4f4"
};
var getStyles = (theme) => ({
  textStyle: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    lineHeight: "1.6",
    color: "inherit"
  },
  headingStyle: (level) => ({
    fontFamily: theme.fontFamily,
    fontWeight: "700",
    marginTop: "1.5rem",
    marginBottom: "1rem",
    color: level === 1 ? theme.headingColor : level === 2 ? theme.subHeading1Color : theme.subHeading2Color,
    fontSize: level === 1 ? "2.25rem" : level === 2 ? "1.75rem" : "1.25rem",
    borderBottom: level <= 2 ? "1px solid #eaeaea" : "none",
    paddingBottom: level <= 2 ? "0.3rem" : "0"
  })
});

// src/index.ts
function mdFlow(markdown, options) {
  const parser = new Parser(options);
  return parser.parse(markdown);
}
export {
  MDFlow,
  Parser,
  mdFlow
};
