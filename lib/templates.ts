export interface Template {
  id: number;
  name: string;
  category: string;
  views: string;
  featured: boolean;
  description: string;
  style:
    | "classic"
    | "portfolio"
    | "oss"
    | "startup"
    | "minimal"
    | "academic"
    | "terminal"
    | "chart";
}

export const templates: Template[] = [
  {
    id: 1,
    name: "Classic Professional",
    category: "General",
    views: "12k",
    featured: true,
    description:
      "Standard template featuring clean titles, installation steps, and usage guide.",
    style: "classic",
  },
  {
    id: 2,
    name: "Developer Portfolio",
    category: "Personal",
    views: "8.5k",
    featured: false,
    description:
      "Personal introduction, experience, stats widget, and tech stack icons.",
    style: "portfolio",
  },
  {
    id: 3,
    name: "OSS Community Hub",
    category: "Community",
    views: "24k",
    featured: true,
    description:
      "Heavy focus on contributions, code of conduct, license, and testing instructions.",
    style: "oss",
  },
  {
    id: 4,
    name: "SaaS Boilerplate",
    category: "Business",
    views: "5.2k",
    featured: false,
    description:
      "Product roadmap, commercial license details, features grid, and team list.",
    style: "startup",
  },
  {
    id: 5,
    name: "Clean Minimalist",
    category: "Design",
    views: "15k",
    featured: false,
    description:
      "Ultra-slim layout emphasizing badges, a single screenshot, and quick start.",
    style: "minimal",
  },
  {
    id: 6,
    name: "Academic Research",
    category: "General",
    views: "3.1k",
    featured: false,
    description:
      "Focuses on citation format, mathematical formulas, datasets, and paper references.",
    style: "academic",
  },
  {
    id: 7,
    name: "Modern E-Commerce",
    category: "Business",
    views: "6.8k",
    featured: false,
    description:
      "Includes checkout integration guides, merchant setup steps, and API docs.",
    style: "startup",
  },
  {
    id: 8,
    name: "Creative API / SDK",
    category: "API & CLI",
    views: "9.2k",
    featured: true,
    description:
      "SDK installation, code examples with syntax highlighting, and API references.",
    style: "terminal",
  },
  {
    id: 9,
    name: "Machine Learning Hub",
    category: "Data Science",
    views: "11.1k",
    featured: true,
    description:
      "Includes training instructions, model evaluation metrics, and dataset links.",
    style: "chart",
  },
  {
    id: 10,
    name: "Game Dev Project",
    category: "Design",
    views: "4.7k",
    featured: false,
    description:
      "Includes controls diagram, asset credits, building requirements, and gameplay gifs.",
    style: "classic",
  },
  {
    id: 11,
    name: "CLI Utility Tool",
    category: "API & CLI",
    views: "14.2k",
    featured: false,
    description:
      "Interactive commands listing, arguments guide, and terminal usage mockup.",
    style: "terminal",
  },
  {
    id: 12,
    name: "Dockerized App",
    category: "General",
    views: "10k",
    featured: false,
    description:
      "Docker Compose startup, environment variable configuration, and volumes guide.",
    style: "classic",
  },
  {
    id: 13,
    name: "Next.js Template",
    category: "Design",
    views: "18.5k",
    featured: true,
    description:
      "Tailwind, ESLint setup guide, routing details, and Vercel deployment.",
    style: "portfolio",
  },
  {
    id: 14,
    name: "Deep Learning Model",
    category: "Data Science",
    views: "7.1k",
    featured: false,
    description:
      "Epoch progression tables, loss/accuracy graphs, and weight links.",
    style: "chart",
  },
  {
    id: 15,
    name: "Rust Library",
    category: "API & CLI",
    views: "13k",
    featured: false,
    description:
      "Cargo setups, safety guarantees, modules map, and benchmark statistics.",
    style: "terminal",
  },
  {
    id: 16,
    name: "Monorepo Setup",
    category: "Business",
    views: "5.5k",
    featured: false,
    description:
      "Workspace layouts, package dependency map, and caching instructions.",
    style: "oss",
  },
  {
    id: 17,
    name: "Chrome Extension",
    category: "Personal",
    views: "6.2k",
    featured: false,
    description:
      "Manifest description, extension loading guide, and store guidelines.",
    style: "minimal",
  },
  {
    id: 18,
    name: "Jupyter Notebook Kit",
    category: "Data Science",
    views: "8.4k",
    featured: false,
    description:
      "Visual data analysis, dependency environments, and execution steps.",
    style: "chart",
  },
  {
    id: 19,
    name: "WordPress Theme",
    category: "Design",
    views: "4.1k",
    featured: false,
    description:
      "Gutenberg blocks compatibility, customizer hooks, and installation.",
    style: "portfolio",
  },
  {
    id: 20,
    name: "Android Gradle Lib",
    category: "API & CLI",
    views: "6.9k",
    featured: false,
    description:
      "Maven coordinate badges, Gradle dependencies, and usage examples.",
    style: "terminal",
  },
  {
    id: 21,
    name: "Cybersecurity Tool",
    category: "Community",
    views: "11.2k",
    featured: false,
    description:
      "Disclaimer, scan configurations, report output layouts, and legal guidelines.",
    style: "terminal",
  },
  {
    id: 22,
    name: "Flutter App Starter",
    category: "Personal",
    views: "9k",
    featured: false,
    description:
      "Cross-platform config, state management notes, and asset structures.",
    style: "portfolio",
  },
  {
    id: 23,
    name: "CSS UI Framework",
    category: "Design",
    views: "16k",
    featured: true,
    description:
      "Class utilities tables, interactive grid builders, and styling tokens.",
    style: "minimal",
  },
  {
    id: 24,
    name: "GraphQL API Server",
    category: "API & CLI",
    views: "8.1k",
    featured: false,
    description:
      "Schema documentation, queries/mutations examples, and Apollo setup.",
    style: "terminal",
  },
  {
    id: 25,
    name: "NFT Smart Contract",
    category: "Business",
    views: "7.3k",
    featured: false,
    description:
      "Gas fee stats, audit details, ABI structures, and Hardhat tasks.",
    style: "oss",
  },
  {
    id: 26,
    name: "Serverless Function",
    category: "General",
    views: "9.9k",
    featured: false,
    description:
      "AWS Lambda / Vercel configurations, handler signatures, and testing keys.",
    style: "classic",
  },
];
