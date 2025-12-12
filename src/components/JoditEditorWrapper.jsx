import { useRef, useMemo, useCallback } from "react";
import JoditEditor from "jodit-react";

export default function JoditEditorWrapper({ value, onChange, height = 200 }) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height,
      toolbarAdaptive: false,
      toolbarSticky: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
      uploader: {
        insertImageAsBase64URI: true,
      },

      // ❌ Disable image pop-up editing
      image: {
        openOnDblClick: false,
        editSrc: false,
        showPreview: false,
      },

      // ❌ Disable resize/crop popup
      resizer: {
        forImage: false,
      },

      // ✨ Toolbar (same as before)
      buttons: [
        "bold",
        "italic",
        "underline",
        "ul",
        "ol",
        "fontsize",
        "align",
        "undo",
        "redo",
        "image",
      ],
    }),
    []
  );

  const handleChange = useCallback(
    (content) => {
      onChange(content);
    },
    [onChange]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      onBlur={handleChange}
      config={config}
    />
  );
}