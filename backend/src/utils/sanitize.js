const DISALLOWED_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "meta",
  "link",
];

const disallowedTagPattern = new RegExp(
  `<\\/?(?:${DISALLOWED_TAGS.join("|")})\\b[^>]*>`,
  "gi"
);

export const sanitizeHtmlContent = (value = "") =>
  String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(disallowedTagPattern, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\son\w+=\{[^}]*\}/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
