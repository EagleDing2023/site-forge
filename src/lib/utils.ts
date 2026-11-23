import { createCn } from "cn/config";

// Our custom font sizes (globals.css @theme --text-*) must be registered, or
// cn() reads `text-small` as a colour and drops it next to `text-muted-2`.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["page-title", "logo", "panel-title", "body", "label", "small", "eyebrow", "badge"] },
      ],
    },
  },
});
