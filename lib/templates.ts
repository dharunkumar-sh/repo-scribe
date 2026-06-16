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
  // GENERAL / CLASSIC
  { id: 1, name: "Classic Professional", category: "General", views: "12k", featured: true, description: "Standard template featuring clean titles, installation steps, and usage guide.", style: "classic" },
  { id: 2, name: "Dockerized App", category: "General", views: "10k", featured: false, description: "Docker Compose startup, environment variable configuration, and volumes guide.", style: "classic" },
  { id: 3, name: "Serverless Function", category: "General", views: "9.9k", featured: false, description: "AWS Lambda / Vercel configurations, handler signatures, and testing keys.", style: "classic" },
  { id: 4, name: "Monorepo Workspace", category: "General", views: "4.5k", featured: false, description: "Lerna/Turborepo project map, workspace linking, and shared scripts.", style: "classic" },
  { id: 5, name: "Microservice Node", category: "General", views: "6.7k", featured: false, description: "Service architecture, environment vars, messaging queues, and health checks.", style: "classic" },
  { id: 6, name: "Web Extension", category: "General", views: "3.2k", featured: false, description: "Browser permission lists, local development reloading, and web store guidelines.", style: "classic" },
  { id: 7, name: "Desktop App (Electron)", category: "General", views: "8.1k", featured: false, description: "Native build instructions, IPC communication patterns, and packaging steps.", style: "classic" },
  { id: 8, name: "Static Site Generator", category: "General", views: "5.4k", featured: false, description: "Hugo/Jekyll build commands, content structure, and deployment workflows.", style: "classic" },

  // PORTFOLIO / PERSONAL
  { id: 9, name: "Developer Portfolio", category: "Personal", views: "8.5k", featured: false, description: "Personal introduction, experience, stats widget, and tech stack icons.", style: "portfolio" },
  { id: 10, name: "Freelancer Showcase", category: "Personal", views: "6.3k", featured: false, description: "Client project highlights, hourly rates, availability, and contact links.", style: "portfolio" },
  { id: 11, name: "Student Graduate", category: "Personal", views: "7.8k", featured: false, description: "University projects, thesis abstract, hackathon wins, and GPA.", style: "portfolio" },
  { id: 12, name: "Designer Profile", category: "Personal", views: "4.9k", featured: false, description: "Dribbble integrations, Figma plugins, aesthetic focus, and design philosophy.", style: "portfolio" },
  { id: 13, name: "Data Scientist CV", category: "Personal", views: "5.5k", featured: true, description: "Kaggle rankings, Jupiter notebook links, model accuracies, and research interests.", style: "portfolio" },
  { id: 14, name: "Game Dev Resume", category: "Personal", views: "3.9k", featured: false, description: "Itch.io links, Unity/Unreal expertise, game jam entries, and engine screenshots.", style: "portfolio" },
  
  // OSS / COMMUNITY
  { id: 15, name: "OSS Community Hub", category: "Community", views: "24k", featured: true, description: "Heavy focus on contributions, code of conduct, license, and testing instructions.", style: "oss" },
  { id: 16, name: "Cybersecurity Tool", category: "Community", views: "11.2k", featured: false, description: "Disclaimer, scan configurations, report output layouts, and legal guidelines.", style: "oss" },
  { id: 17, name: "UI Component Library", category: "Community", views: "18k", featured: true, description: "Storybook links, accessible aria-labels, customizable props table, and bundle size.", style: "oss" },
  { id: 18, name: "Plugin Ecosystem", category: "Community", views: "4.2k", featured: false, description: "Plugin authoring guide, core API hooks, and registry publishing.", style: "oss" },
  { id: 19, name: "Linux Distribution", category: "Community", views: "2.1k", featured: false, description: "ISO compilation, kernel patching, package manager details, and desktop environments.", style: "oss" },
  { id: 20, name: "Blockchain Protocol", category: "Community", views: "9.5k", featured: false, description: "Consensus mechanics, node running instructions, and tokenomics overview.", style: "oss" },
  { id: 21, name: "Discord Bot Repo", category: "Community", views: "15k", featured: false, description: "Invite links, command prefixes, intents configuration, and hosting.", style: "oss" },

  // STARTUP / BUSINESS
  { id: 22, name: "SaaS Boilerplate", category: "Business", views: "5.2k", featured: false, description: "Product roadmap, commercial license details, features grid, and team list.", style: "startup" },
  { id: 23, name: "Modern E-Commerce", category: "Business", views: "6.8k", featured: false, description: "Includes checkout integration guides, merchant setup steps, and API docs.", style: "startup" },
  { id: 24, name: "NFT Smart Contract", category: "Business", views: "7.3k", featured: false, description: "Gas fee stats, audit details, ABI structures, and Hardhat tasks.", style: "startup" },
  { id: 25, name: "Fintech Dashboard", category: "Business", views: "3.4k", featured: false, description: "Plaid integrations, PCI compliance notes, chart layouts, and auth flows.", style: "startup" },
  { id: 26, name: "CRM Application", category: "Business", views: "4.1k", featured: false, description: "Tenant management, sales pipelines, webhook configurations, and integrations.", style: "startup" },
  { id: 27, name: "B2B API Platform", category: "Business", views: "8.8k", featured: true, description: "Rate limiting tiers, SLA commitments, enterprise support, and API key provisioning.", style: "startup" },
  { id: 28, name: "Agency Landing Page", category: "Business", views: "5.9k", featured: false, description: "Client testimonials, service catalogs, contact forms, and SEO strategies.", style: "startup" },

  // MINIMAL / DESIGN
  { id: 29, name: "Clean Minimalist", category: "Design", views: "15k", featured: false, description: "Ultra-slim layout emphasizing badges, a single screenshot, and quick start.", style: "minimal" },
  { id: 30, name: "Next.js Template", category: "Design", views: "18.5k", featured: true, description: "Tailwind, ESLint setup guide, routing details, and Vercel deployment.", style: "minimal" },
  { id: 31, name: "WordPress Theme", category: "Design", views: "4.1k", featured: false, description: "Gutenberg blocks compatibility, customizer hooks, and installation.", style: "minimal" },
  { id: 32, name: "Flutter App Starter", category: "Design", views: "9k", featured: false, description: "Cross-platform config, state management notes, and asset structures.", style: "minimal" },
  { id: 33, name: "CSS UI Framework", category: "Design", views: "16k", featured: true, description: "Class utilities tables, interactive grid builders, and styling tokens.", style: "minimal" },
  { id: 34, name: "Figma Plugin", category: "Design", views: "3.5k", featured: false, description: "Manifest.json setup, UI rendering, and Figma API communications.", style: "minimal" },
  { id: 35, name: "Tailwind Component Kit", category: "Design", views: "12k", featured: false, description: "Copy-paste snippets, configuration overrides, and dark mode support.", style: "minimal" },
  { id: 36, name: "React Native Expo", category: "Design", views: "11k", featured: false, description: "EAS build commands, app store provisioning, and native module linking.", style: "minimal" },

  // ACADEMIC
  { id: 37, name: "Academic Research", category: "General", views: "3.1k", featured: false, description: "Focuses on citation format, mathematical formulas, datasets, and paper references.", style: "academic" },
  { id: 38, name: "PhD Thesis Code", category: "General", views: "1.2k", featured: false, description: "Chapter summaries, raw data parsing, reproducible environments, and methodology.", style: "academic" },
  { id: 39, name: "Bioinformatics Pipeline", category: "General", views: "2.8k", featured: false, description: "Genome sequencing tools, cluster execution scripts, and memory requirements.", style: "academic" },
  { id: 40, name: "Quantum Computing Simulator", category: "General", views: "1.5k", featured: false, description: "Qubit operations, entanglement math, algorithms, and limitations.", style: "academic" },
  { id: 41, name: "Economics Modeling", category: "General", views: "2.2k", featured: false, description: "Stata/R scripts, macroeconomic datasets, regressions, and literature review.", style: "academic" },

  // API & CLI / TERMINAL
  { id: 42, name: "Creative API / SDK", category: "API & CLI", views: "9.2k", featured: true, description: "SDK installation, code examples with syntax highlighting, and API references.", style: "terminal" },
  { id: 43, name: "CLI Utility Tool", category: "API & CLI", views: "14.2k", featured: false, description: "Interactive commands listing, arguments guide, and terminal usage mockup.", style: "terminal" },
  { id: 44, name: "Rust Library", category: "API & CLI", views: "13k", featured: false, description: "Cargo setups, safety guarantees, modules map, and benchmark statistics.", style: "terminal" },
  { id: 45, name: "Android Gradle Lib", category: "API & CLI", views: "6.9k", featured: false, description: "Maven coordinate badges, Gradle dependencies, and usage examples.", style: "terminal" },
  { id: 46, name: "GraphQL API Server", category: "API & CLI", views: "8.1k", featured: false, description: "Schema documentation, queries/mutations examples, and Apollo setup.", style: "terminal" },
  { id: 47, name: "Go Micro-framework", category: "API & CLI", views: "7.7k", featured: false, description: "Goroutine patterns, high concurrency benchmarks, and router setup.", style: "terminal" },
  { id: 48, name: "Vim Plugin", category: "API & CLI", views: "5.1k", featured: false, description: "Keybindings, init.lua configurations, lazy loading, and Neovim support.", style: "terminal" },

  // DATA SCIENCE / CHART
  { id: 49, name: "Machine Learning Hub", category: "Data Science", views: "11.1k", featured: true, description: "Includes training instructions, model evaluation metrics, and dataset links.", style: "chart" },
  { id: 50, name: "Deep Learning Model", category: "Data Science", views: "7.1k", featured: false, description: "Epoch progression tables, loss/accuracy graphs, and weight links.", style: "chart" },
  { id: 51, name: "Jupyter Notebook Kit", category: "Data Science", views: "8.4k", featured: false, description: "Visual data analysis, dependency environments, and execution steps.", style: "chart" },
  { id: 52, name: "Data Engineering ETL", category: "Data Science", views: "4.3k", featured: false, description: "Airflow DAGs, Spark clusters, database migrations, and pipeline monitoring.", style: "chart" },
  { id: 53, name: "NLP Transformer", category: "Data Science", views: "6.6k", featured: false, description: "HuggingFace integrations, tokenization limits, fine-tuning scripts, and BLEU scores.", style: "chart" },
  { id: 54, name: "Computer Vision Tracker", category: "Data Science", views: "5.8k", featured: false, description: "YOLO/OpenCV configurations, bounding box accuracy, and video processing speeds.", style: "chart" },
  { id: 55, name: "Web Scraper Toolkit", category: "Data Science", views: "9.9k", featured: false, description: "Selenium/Puppeteer scripts, proxy rotation, CAPTCHA handling, and JSON exports.", style: "chart" }
];
