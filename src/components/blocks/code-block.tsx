import React from "react";

export const CodeBlock = ({ code, theme }: { code: string; theme: any }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", margin: "1.5rem 0" }}>
      <button
        onClick={copyToClipboard}
        style={{
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
          zIndex: 10,
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        style={{
          backgroundColor: theme.codeBackground || "#f4f4f4",
          padding: "0.8rem",
          borderRadius: theme.tableCurve || "8px",
          overflowX: "auto",
          border: "1px solid #eee",
          margin: 0,
        }}
      >
        <code style={{ fontFamily: "monospace", color: "#fff", fontSize: "14px" }}>
          {code}
        </code>
      </pre>
    </div>
  );
};