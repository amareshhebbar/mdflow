"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MDFlow: () => MDFlow,
  Parser: () => Parser,
  mdFlow: () => mdFlow
});
module.exports = __toCommonJS(index_exports);

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

// src/components/MDFlow.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var MDFlow = ({ text, file, className }) => {
  const [content, setContent] = (0, import_react.useState)(text || "");
  const parser = new Parser();
  (0, import_react.useEffect)(() => {
    if (file) {
      fetch(file).then((res) => res.text()).then((data) => setContent(data)).catch((err) => console.error("MDFlow failed to load file:", err));
    }
  }, [file]);
  (0, import_react.useEffect)(() => {
    if (text) setContent(text);
  }, [text]);
  const htmlContent = parser.parse(content);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: `mdflow-container ${className || ""}`,
      dangerouslySetInnerHTML: { __html: htmlContent }
    }
  );
};

// src/index.ts
function mdFlow(markdown, options) {
  const parser = new Parser(options);
  return parser.parse(markdown);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MDFlow,
  Parser,
  mdFlow
});
