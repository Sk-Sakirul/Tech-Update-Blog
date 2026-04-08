/* eslint-disable react-refresh/only-export-components */
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from "../conf/conf";
import { memo } from "react";

const RTE = memo(function RTE({
  name,
  control,
  defaultValue = "Write your post content here...",
}) {
  return (
    <div className="w-full">
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={conf.tinyMCEreactApi}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: false,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style:
                "body { font-family:Inter,system-ui,sans-serif; font-size:18px; line-height:1.7 }",
              skin: window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "oxide-dark"
                : "oxide",
              content_css: window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "default",
              resize: false,
              inline: false,
              statusbar: false,
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
});

export default RTE;
