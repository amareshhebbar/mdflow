import React from "react";

export const renderTable = (lines: string[], startIndex: number, theme: any) => {
    const rows = [];
    let i = startIndex;
    while (lines[i] && lines[i].trim().startsWith("|")) {
        const line = lines[i].trim();
        if (!line.includes("---")) {
            const cells = line.split("|").map(s => s.trim()).filter(Boolean);
            rows.push(cells);
        }
        i++;
    }

  return (
        <div style={{ margin: "20px 0", borderRadius: theme.tableCurve, border: "1px solid #eee", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                        {rows[0]?.map((col, idx) => (
                            <th key={idx} style={{ padding: theme.tablePadding, textAlign: "left" }}>
                                {parseInlineContent(col, theme)} 
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.slice(1).map((row, ri) => (
                        <tr key={ri}>
                            {row.map((cell, ci) => (
                                <td key={ci} style={{ padding: theme.tablePadding, borderBottom: "1px solid #eee" }}>
                                    {parseInlineContent(cell, theme)} 
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const renderLink = (line: string, index: number, theme: any, textStyle: any) => {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts = line.split(/(\[.*?\]\(.*?\))/g);

  return (
    <p key={index} style={{ ...textStyle, margin: "0.5em 0" }}>
      {parts.map((part, i) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [_, linkText, href] = match;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme?.linkColor || "#0070f3",
                textDecoration: theme?.showLinkUnderline ? "underline" : "none",
                fontWeight: theme?.showLinkBold ? "bold" : "normal",
              }}
            >
              {linkText}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
};

export const parseInlineContent = (text: string, theme: any): React.ReactNode => {
  if (!text) return "";

  const combinedRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(combinedRegex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const innerText = part.slice(2, -2);
      return (
        <strong key={i}>
          {parseInlineContent(innerText, theme)}
        </strong>
      );
    }

    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [_, linkText, href] = linkMatch;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme?.linkColor || "#0070f3",
            textDecoration: theme?.showLinkUnderline ? "underline" : "none",
            fontWeight: theme?.showLinkBold ? "bold" : "normal",
          }}
        >
          {linkText}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
};