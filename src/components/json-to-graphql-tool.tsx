"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, Braces, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolEvents } from "@/lib/analytics";

const EXAMPLE_JSON = `{
  "id": "u_123",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "score": 9.5,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  },
  "tags": ["developer", "designer"],
  "posts": [
    {
      "id": "p_1",
      "title": "Hello World",
      "published": true,
      "likes": 42
    }
  ]
}`;

type GraphQLFieldType =
  | "String"
  | "Int"
  | "Float"
  | "Boolean"
  | "ID"
  | string;

interface GraphQLField {
  name: string;
  type: GraphQLFieldType;
  isList: boolean;
}

interface GraphQLType {
  name: string;
  fields: GraphQLField[];
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase());
}

const ID_FIELD_NAMES = new Set(["id", "_id", "uuid", "guid"]);

function inferScalar(value: unknown, fieldName: string): GraphQLFieldType {
  if (ID_FIELD_NAMES.has(fieldName.toLowerCase())) return "ID";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "Int" : "Float";
  }
  return "String";
}

function convertJsonToTypes(
  obj: Record<string, unknown>,
  typeName: string,
  types: Map<string, GraphQLType>
): void {
  const fields: GraphQLField[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields.push({ name: key, type: "String", isList: false });
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        fields.push({ name: key, type: "String", isList: true });
      } else {
        const first = value[0];
        if (first !== null && typeof first === "object" && !Array.isArray(first)) {
          const nestedTypeName = toPascalCase(key.replace(/s$/, ""));
          convertJsonToTypes(first as Record<string, unknown>, nestedTypeName, types);
          fields.push({ name: key, type: nestedTypeName, isList: true });
        } else {
          fields.push({ name: key, type: inferScalar(first, key), isList: true });
        }
      }
      continue;
    }

    if (typeof value === "object") {
      const nestedTypeName = toPascalCase(key);
      convertJsonToTypes(value as Record<string, unknown>, nestedTypeName, types);
      fields.push({ name: key, type: nestedTypeName, isList: false });
      continue;
    }

    fields.push({ name: key, type: inferScalar(value, key), isList: false });
  }

  types.set(typeName, { name: typeName, fields });
}

function typesToSDL(types: Map<string, GraphQLType>, rootName: string): string {
  const lines: string[] = [];

  const orderedKeys = [rootName, ...Array.from(types.keys()).filter((k) => k !== rootName)];

  for (const key of orderedKeys) {
    const gqlType = types.get(key);
    if (!gqlType) continue;
    lines.push(`type ${gqlType.name} {`);
    for (const field of gqlType.fields) {
      const typeStr = field.isList ? `[${field.type}]` : field.type;
      lines.push(`  ${field.name}: ${typeStr}`);
    }
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n").trim();
}

function convertJsonToGraphQL(jsonStr: string): { sdl: string; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return { sdl: "", error: "Invalid JSON — please check your input." };
  }

  let target: Record<string, unknown>;
  let rootTypeName = "Root";

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return { sdl: "", error: "Empty array — paste a JSON object or a non-empty array." };
    }
    const first = parsed[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) {
      return { sdl: "", error: "Top-level arrays must contain objects." };
    }
    target = first as Record<string, unknown>;
    rootTypeName = "Item";
  } else if (typeof parsed === "object" && parsed !== null) {
    target = parsed as Record<string, unknown>;
  } else {
    return { sdl: "", error: "Input must be a JSON object or array of objects." };
  }

  const types = new Map<string, GraphQLType>();
  convertJsonToTypes(target, rootTypeName, types);
  const sdl = typesToSDL(types, rootTypeName);
  return { sdl, error: null };
}

export function JsonToGraphqlTool() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [copied, setCopied] = useState(false);

  const { sdl, error } = convertJsonToGraphQL(input);

  const handleCopy = useCallback(() => {
    if (!sdl) return;
    navigator.clipboard.writeText(sdl).then(() => {
      setCopied(true);
      toast.success("GraphQL schema copied!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sdl]);

  const handleReset = useCallback(() => {
    setInput(EXAMPLE_JSON);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      if (e.target.value !== EXAMPLE_JSON) {
        ToolEvents.toolUsed("convert");
      }
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-xl shadow-brand/5">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <Braces className="h-4 w-4 text-brand" />
            <span className="text-sm font-medium">JSON → GraphQL Schema</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleCopy}
              disabled={!sdl}
              className="gap-1.5 bg-gradient-to-r from-brand to-brand-accent text-white shadow-sm shadow-brand/25"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy Schema"}
            </Button>
          </div>
        </div>

        {/* Editor panes */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50 min-h-[420px]">
          {/* Input */}
          <div className="flex flex-col">
            <div className="px-4 py-2 border-b border-border/30 bg-muted/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                JSON Input
              </span>
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              spellCheck={false}
              placeholder="Paste your JSON here…"
              className="flex-1 w-full resize-none bg-transparent p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[380px]"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col">
            <div className="px-4 py-2 border-b border-border/30 bg-muted/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                GraphQL Schema (SDL)
              </span>
            </div>
            {error ? (
              <div className="flex-1 flex items-start gap-3 p-4 text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-sm font-mono">{error}</span>
              </div>
            ) : (
              <pre className="flex-1 p-4 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap min-h-[380px]">
                {sdl}
              </pre>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border/30 bg-muted/20 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand/60" />
          All conversion runs in your browser — your data never leaves your device.
        </div>
      </div>
    </motion.div>
  );
}
