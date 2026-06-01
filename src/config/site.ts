export const siteConfig = {
  name: "JSON to GraphQL",
  title: "JSON to GraphQL Schema Converter — Free Online Tool",
  description:
    "Convert JSON data or JSON objects to GraphQL Schema Definition Language (SDL) instantly. Smart type inference, nested types, list detection, and nullable fields — 100% free, no login required.",
  url: "https://json-to-graphql.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Braces",
  brandAccentColor: "#ec4899",

  keywords: [
    "json to graphql",
    "json to graphql schema",
    "json to graphql converter",
    "graphql schema generator",
    "json to sdl converter",
    "graphql type generator",
    "json schema to graphql",
    "online graphql schema converter",
    "free graphql schema tool",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#a855f7",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/json-to-graphql",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "JSON to GraphQL is a free browser-based tool that converts JSON data into GraphQL Schema Definition Language (SDL). No backend, no data uploads — everything runs in your browser.",
    featuresTitle: "Features",
    features: [
      "Smart type inference",
      "Nested object types",
      "List / array support",
      "Nullable field detection",
    ],
  },

  hero: {
    badge: "Free GraphQL Schema Generator",
    titleLine1: "Convert JSON to",
    titleGradient: "GraphQL Schema",
    subtitle:
      "Paste any JSON object and instantly get a complete GraphQL SDL with smart type inference, nested types, and list fields. No login. No server. Just paste and copy.",
  },

  featureCards: [
    {
      icon: "🧠",
      title: "Smart Type Inference",
      description:
        "Automatically detects String, Int, Float, Boolean, and ID types from JSON values.",
    },
    {
      icon: "🔗",
      title: "Nested & List Types",
      description:
        "Handles deeply nested objects and arrays, generating correct GraphQL types recursively.",
    },
    {
      icon: "⚡",
      title: "Instant & Private",
      description:
        "Runs entirely in the browser — nothing is uploaded to any server. Fast, private, and free.",
    },
  ],

  relatedTools: [
    {
      name: "JSON to TypeScript",
      url: "https://json-to-typescript.tools.jagodana.com",
      icon: "📘",
      description: "Convert JSON to TypeScript interfaces instantly.",
    },
    {
      name: "JSON to Zod",
      url: "https://json-to-zod.tools.jagodana.com",
      icon: "🛡️",
      description: "Generate Zod schemas from JSON data.",
    },
    {
      name: "JSON Schema Generator",
      url: "https://json-schema-generator.tools.jagodana.com",
      icon: "📋",
      description: "Generate JSON Schema from any JSON object.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "✨",
      description: "Format and beautify JSON data instantly.",
    },
    {
      name: "JSON to SQL",
      url: "https://json-to-sql.tools.jagodana.com",
      icon: "🗄️",
      description: "Convert JSON objects to SQL CREATE TABLE statements.",
    },
    {
      name: "JSON Diff Viewer",
      url: "https://json-diff-viewer.tools.jagodana.com",
      icon: "🔍",
      description: "Compare two JSON objects and highlight differences.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your JSON",
      text: "Paste any valid JSON object or array into the input editor on the left.",
      url: "",
    },
    {
      name: "Get GraphQL SDL instantly",
      text: "The tool automatically generates a complete GraphQL Schema Definition Language with correct types for every field.",
      url: "",
    },
    {
      name: "Copy and use",
      text: "Click 'Copy Schema' to copy the generated SDL to your clipboard and paste it into your GraphQL project.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is GraphQL SDL?",
      answer:
        "GraphQL Schema Definition Language (SDL) is the syntax used to define the structure of a GraphQL API — including types, fields, and their relationships. It is the standard way to describe a GraphQL schema.",
    },
    {
      question: "How does the type inference work?",
      answer:
        "The tool inspects each JSON value: numbers without decimals become Int, numbers with decimals become Float, true/false become Boolean, and strings become String. Fields named 'id', '_id', or 'uuid' are inferred as ID. Arrays produce list types (e.g. [String]), and nested objects generate separate named types.",
    },
    {
      question: "Are nullable fields handled correctly?",
      answer:
        "Yes. In the generated schema, all fields are nullable by default (which is idiomatic GraphQL). You can add exclamation marks (!) to mark fields as non-null after generation if needed.",
    },
    {
      question: "Does this tool send my data to a server?",
      answer:
        "No. The entire conversion runs in your browser using JavaScript. Your JSON data never leaves your device — there is no backend, no API call, and no data collection.",
    },
    {
      question: "Can I convert nested JSON objects?",
      answer:
        "Yes. Nested objects are converted to separate named GraphQL types and referenced by name in the parent type. Arrays of objects produce list types referencing the generated nested type.",
    },
    {
      question: "What if my JSON has mixed-type arrays?",
      answer:
        "The tool inspects the first element of each array to determine its type. For mixed-type arrays, it falls back to String. It is recommended to review and adjust the generated schema for edge cases.",
    },
  ],

  pages: {
    "/": {
      title: "JSON to GraphQL Schema Converter — Free Online Tool",
      description:
        "Convert JSON data or JSON objects to GraphQL Schema Definition Language (SDL) instantly. Smart type inference, nested types, list detection — 100% free, no login required.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
