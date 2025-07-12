'use client';

import { useRef } from 'react';
import Editor, { EditorProps, OnMount } from '@monaco-editor/react';
import YAML from 'yaml';
import * as monaco from 'monaco-editor';
import { ruleSchema } from '@/zodScheme/ruleBased';
import { chakra } from '@chakra-ui/react';

const ChakraEditor = chakra(Editor);

interface Props extends EditorProps {}

export function RuleYamlEditor({ ...props }: Props) {
  const monacoRef = useRef<typeof monaco | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);

  const handleEditorMount: OnMount = (editor, monacoInstance) => {
    monacoRef.current = monacoInstance;
    modelRef.current = editor.getModel();
  };

  const findLineForPath = (yamlContent: string, path: (string | number)[]) => {
    const lines = yamlContent.split('\n');
    const pathStr = path.join('.');
    
    // Tìm line chứa field tương ứng
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Kiểm tra nếu line chứa field name
      if (path.length > 0) {
        const lastPath = path[path.length - 1];
        if (trimmed.startsWith(`${lastPath}:`)) {
          return i + 1;
        }
      }
    }
    
    return 1; // fallback
  };

  const handleChange = (value: string | undefined) => {
    if (!value || !monacoRef.current || !modelRef.current) return;

    try {
      const parsed = YAML.parse(value);
      const result = ruleSchema.safeParse(parsed);

      if (!result.success) {
        const markers: monaco.editor.IMarkerData[] = result.error.issues.map((issue) => {
          const filteredPath = issue.path.filter((p): p is string | number => typeof p === 'string' || typeof p === 'number');
          const lineNumber = findLineForPath(value, filteredPath);
          const pathStr = filteredPath.length > 0 ? filteredPath.join('.') : 'root';
          
          return {
            message: `[${pathStr}] ${issue.message}${issue.code ? ` (${issue.code})` : ''}`,
            severity: monacoRef.current!.MarkerSeverity.Error,
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: 100,
            source: 'zod-validation'
          };
        });

        monacoRef.current.editor.setModelMarkers(modelRef.current, 'zod', markers);
      } else {
        monacoRef.current.editor.setModelMarkers(modelRef.current, 'zod', []);
      }
    } catch (yamlError: any) {
      console.log('YAML parse error:', yamlError);
      
      // Cố gắng extract line number từ YAML error
      let lineNumber = 1;
      let columnNumber = 1;
      
      if (yamlError.linePos) {
        lineNumber = yamlError.linePos[0].line;
        columnNumber = yamlError.linePos[0].col;
      } else if (yamlError.message) {
        const lineMatch = yamlError.message.match(/line (\d+)/);
        const colMatch = yamlError.message.match(/column (\d+)/);
        if (lineMatch) lineNumber = parseInt(lineMatch[1]);
        if (colMatch) columnNumber = parseInt(colMatch[1]);
      }
      
      monacoRef.current.editor.setModelMarkers(modelRef.current, 'yaml-parse', [
        {
          message: `YAML Syntax Error: ${yamlError.message || 'Invalid YAML format'}`,
          severity: monacoRef.current.MarkerSeverity.Error,
          startLineNumber: lineNumber,
          startColumn: columnNumber,
          endLineNumber: lineNumber,
          endColumn: columnNumber + 5,
          source: 'yaml-parser'
        },
      ]);
    }
  };

  const defaultValue = `id: rule-ml-v1
name: Detect Money Laundering
interval: 1h
enabled: true
when:
  and:
    - type: aggregate
      field: amount
      op: sum
      operator: ">="
      value: 10000
then:
  - type: tag
    value: "suspicious-activity"`;

  return (
    <ChakraEditor
      height="500px"
      width="100%"
      defaultLanguage="yaml"
      defaultValue={defaultValue}
      onMount={handleEditorMount}
      onChange={handleChange}
      theme="vs-dark"
      {...props}
    />
  );
}