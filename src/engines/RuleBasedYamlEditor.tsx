'use client';

import { useState } from 'react';
import Editor, { type EditorProps } from '@monaco-editor/react';

export function RuleBasedYamlEditor(props: EditorProps) {
  const [value, setValue] = useState<string>("");

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || "");
    console.log("Editor content:", newValue);
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      defaultValue="// Write your code here"
      onChange={handleChange}
      theme="vs-dark"
      {...props}
    />
  );
}