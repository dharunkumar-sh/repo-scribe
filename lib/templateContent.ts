import { Template } from "@/lib/templates";

export const getSampleData = (template: Template): string => {
  switch (template.id) {
    case 1:
      return `# Classic Professional

A robust, production-ready system.

## Prerequisites
- Node.js

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
Run the app via \`npm start\`.`;

    case 2:
      return `# 🐳 Dockerized App

Microservice architecture using Docker Compose.

## Startup
\`\`\`bash
docker-compose up --build -d
\`\`\`

## Environment Variables
Copy \`.env.example\` to \`.env\` and configure your secrets.`;

    case 3:
      return `# ⚡ Serverless Function

AWS Lambda deployment scripts and handlers.

## Deploy
\`\`\`bash
serverless deploy --stage prod
\`\`\`

## Handlers
The main entry point is \`handler.js\`.`;

    case 4:
      return `# 📦 Monorepo Workspace

Lerna and Turborepo managed monorepo containing multiple packages and apps.

## Scripts
\`\`\`bash
npm run build --workspaces
\`\`\``;

    case 5:
      return `# 🌐 Microservice Node

A scalable Node.js microservice communicating via RabbitMQ.

## Health Checks
Endpoint: \`/api/health\`

## Start
\`\`\`bash
npm run start:prod
\`\`\``;

    case 6:
      return `# 🧩 Web Extension

Chrome/Firefox extension built with Manifest V3.

## Load Unpacked
1. Go to \`chrome://extensions/\`
2. Enable Developer Mode
3. Click "Load unpacked" and select the \`/dist\` folder.`;

    case 7:
      return `# 🖥️ Desktop App (Electron)

Cross-platform desktop application.

## Packaging
\`\`\`bash
npm run make:mac
npm run make:win
\`\`\``;

    case 8:
      return `# 📝 Static Site Generator

A blog generated using Hugo.

## Create Post
\`\`\`bash
hugo new posts/my-new-post.md
hugo server -D
\`\`\``;

    case 9:
      return `<div align="center">
  <h1>Hi, I'm a Developer 👋</h1>
  <p>Full Stack Engineer</p>
</div>

## Skills
React, Node, Go, Rust`;

    case 10:
      return `# Freelancer Portfolio

Available for hire! Check out my case studies below.

## Services
- Web Development
- UI/UX Design
- SEO Optimization`;

    case 11:
      return `# Computer Science Graduate

BSc Computer Science portfolio showcasing university assignments and hackathon wins.

## Projects
- Compiler Construction
- Operating Systems
- AI Pathfinding`;

    case 12:
      return `# Product Designer

Figma prototypes, design systems, and UX research case studies.

## Links
- [Dribbble](#)
- [Behance](#)`;

    case 13:
      return `# Data Scientist CV

Kaggle Grandmaster showcasing Jupyter notebooks, deep learning architectures, and EDA.

## Competitions
- Titanic (Top 5%)
- House Prices (Top 1%)`;

    case 14:
      return `# Game Developer

Unity and Unreal Engine C++ projects.

## Titles
- "Space Explorer" (Itch.io Game Jam Winner)
- "Pixel Dungeon" (Steam Early Access)`;

    case 15:
      return `# 🌍 Open Source Community Hub

Welcome to our community repository!

## Contributing
Please read \`CONTRIBUTING.md\` and our Code of Conduct before making a PR.`;

    case 16:
      return `# 🔐 Cybersecurity Audit Tool

Open-source penetration testing utility.

## Disclaimer
Usage of this tool for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable laws.`;

    case 17:
      return `# 🧱 React Component Library

Accessible, customizable UI components.

## Storybook
View our interactive documentation at \`https://storybook.example.com\`.`;

    case 18:
      return `# 🔌 Plugin Ecosystem

Core API for building third-party plugins.

## Writing a Plugin
Implement the \`IPlugin\` interface and export it as default.`;

    case 19:
      return `# 🐧 Custom Linux Distro

Build scripts for compiling a custom Arch-based ISO.

## ISO Generation
\`\`\`bash
sudo ./build.sh -v
\`\`\``;

    case 20:
      return `# 🔗 Layer 2 Blockchain Protocol

Zero-knowledge rollup implementation.

## Running a Node
\`\`\`bash
docker run -p 8545:8545 protocol/node:latest
\`\`\``;

    case 21:
      return `# 🤖 Discord Bot

Multi-purpose moderation and music bot.

## Invite
[Click here to invite the bot to your server](#)

## Commands
- \`!play <url>\`
- \`!kick <@user>\``;

    case 22:
      return `
<div align="center">
  <h1>🚀 SaaS Boilerplate</h1>
  <p>The ultimate full-stack Next.js + Supabase + Stripe starter kit.</p>
</div>

## ✨ Key Features
- **Auth**: Fully configured Supabase authentication
- **Billing**: Stripe webhooks and subscription plans
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS and Radix UI components

## 🗺️ Tech Architecture
\`\`\`mermaid
graph TD;
    Client-->Next.js;
    Next.js-->Supabase;
    Next.js-->Stripe;
\`\`\`
`;

    case 23:
      return `
# 🛒 Modern E-Commerce Storefront

A headless e-commerce solution integrating Shopify Storefront API and Next.js Commerce.

## 🛍️ Features
- Instant page loads via React Server Components
- Shopify Cart & Checkout integration
- Sanity CMS for blog content
- Redis caching for inventory checks

## 🔌 Environment Variables
\`\`\`env
SHOPIFY_STOREFRONT_TOKEN=xyz
SHOPIFY_STORE_DOMAIN=my-store.myshopify.com
\`\`\`
`;

    case 24:
      return `
# 💎 ERC721A NFT Smart Contract

Gas-optimized Smart Contract using Azuki's ERC721A standard, audited by CertiK.

## 🔨 Hardhat Tasks
\`\`\`bash
npx hardhat compile
npx hardhat test
npx hardhat deploy --network mainnet
\`\`\`

## 🧾 Contract Details
- **Network**: Ethereum Mainnet
- **Mint Price**: 0.05 ETH
- **Max Supply**: 10,000

## 🔐 Security
The contracts in this repository have undergone an extensive audit. Read the [Audit Report](./audit.pdf).
`;

    case 25:
      return `
# 🏦 Fintech Analytics Dashboard

Real-time financial dashboard built for banking administration. PCI compliant architecture.

## 📈 Integration Partners
- **Plaid**: Bank account linking and transaction sync
- **Stripe**: Payment processing
- **Auth0**: Enterprise SSO and MFA

## 🔒 Compliance Note
This repository does not store raw PAN data. All sensitive financial routing is tokenized.
`;

    case 26:
      return `
# 🤝 CRM Application

Multi-tenant Customer Relationship Management system built with Laravel and Vue.js.

## 🧩 Modules
- Leads Pipeline
- Email Campaigns (SendGrid integration)
- Calendly Sync
- Role-Based Access Control (RBAC)

## 📦 Setup
\`\`\`bash
composer install
php artisan migrate --seed
php artisan serve
\`\`\`
`;

    case 27:
      return `
# 🏢 Enterprise B2B API Platform

High-throughput, highly-available RESTful API gateway for B2B integrations.

## 📊 SLAs & Rate Limits
- **Free Tier**: 1,000 req/month (10 req/sec)
- **Enterprise**: 1,000,000 req/month (500 req/sec)

## 🛡️ Authentication
All endpoints require an \`X-API-KEY\` header.
\`\`\`bash
curl -H "X-API-KEY: your_api_key" https://api.b2bplatform.com/v1/customers
\`\`\`
`;

    case 28:
      return `
# 🎨 Agency Landing Page

High-conversion landing page for digital marketing agencies, optimized for Core Web Vitals.

## ⚡ Performance Scores
- Lighthouse Performance: 99
- Accessibility: 100
- SEO: 100

## 🛠️ CMS Integration
Content is managed via Framer CMS. Modify the \`content\` folder to deploy new case studies.
`;

    case 29:
      return `# project-name

A zero-dependency, ultra-lightweight library.

\`\`\`bash
npm i project-name
\`\`\`

\`\`\`js
import { run } from 'project-name';
run();
\`\`\``;

    case 30:
      return `
# 🔺 Next.js Production Template

\`\`\`bash
npx create-next-app@latest -e https://github.com/user/next-template
\`\`\`

Includes: App Router, Tailwind v4, ESLint strict, Prettier, and Husky git hooks.
`;

    case 31:
      return `
# 📰 WordPress Theme: MinimalPress

A modern, block-enabled (Gutenberg) WordPress theme built with React and PHP.

## 📂 Installation
1. Download the \`.zip\` release.
2. Upload via WordPress Admin -> Appearance -> Themes.
3. Activate the theme.
`;

    case 32:
      return `
# 🦋 Flutter App Starter

A scalable boilerplate for cross-platform iOS and Android apps using Riverpod state management.

## 📱 Run
\`\`\`bash
flutter pub get
flutter run
\`\`\`

## 🏗️ Architecture
Uses Domain-Driven Design (DDD) with clear separation between UI, Application, and Infrastructure layers.
`;

    case 33:
      return `
# 💅 GlassCSS Framework

A utility-first CSS framework dedicated exclusively to glassmorphism UI components.

## 🔗 CDN
\`\`\`html
<link rel="stylesheet" href="https://cdn.glasscss.com/v1.0.0/glass.min.css">
\`\`\`

## 🖌️ Example
\`\`\`html
<div class="glass-panel blur-md bg-white/10 border-white/20">
  Content here
</div>
\`\`\`
`;

    case 34:
      return `
# 🎨 Figma Plugin: Auto-Layout Automator

A Figma plugin that automatically applies Auto Layout to selected layers based on proximity.

## 🛠️ Development
\`\`\`bash
npm install
npm run build:watch
\`\`\`
Then link the \`manifest.json\` in your Figma desktop app under Plugins -> Development.
`;

    case 35:
      return `
# 🌊 Tailwind UI Kit

Copy-paste Tailwind CSS components for rapid UI development.

## 🧩 Usage
Simply copy the HTML snippets from the \`components/\` directory. Requires \`@tailwindcss/forms\` plugin in your \`tailwind.config.js\`.
`;

    case 36:
      return `
# 📱 React Native Expo App

Universal React Native app utilizing Expo Router and EAS Build.

## 🚀 Start
\`\`\`bash
npx expo start
\`\`\`

## 🛠️ EAS Build Commands
\`\`\`bash
eas build --platform ios --profile preview
eas build --platform android --profile production
\`\`\`
`;

    case 37:
      return `
# 📄 Academic Research Paper: Novel Approach to X

Code and datasets for the paper "A Novel Approach to X" (ICML 2026).

## 📊 Dataset
Download the raw data from [Zenodo](https://zenodo.org).

## 📌 Citation
\`\`\`bibtex
@inproceedings{author2026novel,
  title={A Novel Approach to X},
  author={Lastname, Firstname},
  booktitle={ICML},
  year={2026}
}
\`\`\`
`;

    case 38:
      return `
# 🎓 PhD Thesis Code Repository

This repository contains all R and Python scripts used for statistical modeling in chapters 3, 4, and 5 of my thesis.

## 📂 Structure
- \`/chapter3/\`: Survival analysis scripts (R)
- \`/chapter4/\`: Neural network models (PyTorch)
- \`/chapter5/\`: Visualization and plotting scripts
`;

    case 39:
      return `
# 🧬 Genomics Sequencing Pipeline

A Nextflow pipeline for processing RNA-seq data from FASTQ files to differential expression matrices.

## ⚙️ Execution
\`\`\`bash
nextflow run main.nf -profile docker --reads '*_R{1,2}.fastq.gz' --genome GRCh38
\`\`\`

## 🛠️ Dependencies
- Nextflow >= 22.0
- Docker or Singularity
- FastQC, STAR, featureCounts
`;

    case 40:
      return `
# ⚛️ Quantum Circuit Simulator

Simulate up to 30 qubits locally using tensor network contraction algorithms.

## 🚀 Example
\`\`\`python
from quantum_sim import Circuit, H, CNOT

qc = Circuit(2)
qc.apply(H, 0)
qc.apply(CNOT, 0, 1)

state = qc.simulate()
print(state.probabilities())
\`\`\`
`;

    case 41:
      return `
# 📉 Macroeconomic Agent-Based Model

A Python-based simulation environment for modeling inflationary shocks across agent networks.

## 📊 Replicating Figures
To reproduce the figures in the main text, run:
\`\`\`bash
python scripts/generate_figures.py
\`\`\`
`;

    case 42:
      return `
# 🎨 Creative API SDK

Official Node.js SDK wrapper for the Creative API.

## 📦 Install
\`\`\`bash
npm install @creative/sdk
\`\`\`

## 🔑 Authentication
Initialize the client using your secret API key:
\`\`\`typescript
import { CreativeClient } from '@creative/sdk';

const client = new CreativeClient({
  apiKey: process.env.CREATIVE_API_KEY,
});

const response = await client.generateImage({
  prompt: "A beautiful sunset",
});
\`\`\`
`;

    case 43:
      return `
# 🖥️ CLI Utility Tool

[![npm version](https://img.shields.io/npm/v/cli-utility)](https://www.npmjs.com/package/cli-utility)

A powerful command-line interface for managing cloud resources directly from your terminal.

## ⚡ Installation
\`\`\`bash
npm install -g cli-utility
# or via Homebrew
brew install cli-utility
\`\`\`

## 📖 Commands
| Command | Description |
|---------|-------------|
| \`cli init\` | Initialize configuration file |
| \`cli deploy --prod\` | Deploy resources to production |

\`\`\`bash
$ cli status
[SUCCESS] All cloud services are currently active.
\`\`\`
`;

    case 44:
      return `
# 🦀 Rust Library

[![Crates.io](https://img.shields.io/crates/v/rust_library.svg)](https://crates.io/crates/rust_library)
[![Documentation](https://docs.rs/rust_library/badge.svg)](https://docs.rs/rust_library)

A high-performance memory-safe library written in Rust.

## 📦 Installation
Add this to your \`Cargo.toml\`:
\`\`\`toml
[dependencies]
rust_library = "1.0.0"
\`\`\`

## 🚀 Usage
\`\`\`rust
use rust_library::prelude::*;

fn main() {
    let engine = Engine::new();
    engine.process_data().expect("Processing failed");
}
\`\`\`

## 🛡️ Safety & Benchmarks
This library uses \`#![forbid(unsafe_code)]\` and is benchmarked against standard tools. Run tests via \`cargo bench\`.
`;

    case 45:
      return `
# 🤖 Android Gradle Lib

[![Maven Central](https://img.shields.io/maven-central/v/com.example/android-lib.svg)](https://search.maven.org/artifact/com.example/android-lib)

A lightweight library to accelerate Android UI development.

## 🔧 Setup
Add the dependency to your \`build.gradle\`:
\`\`\`groovy
dependencies {
    implementation 'com.example:android-lib:2.4.0'
}
\`\`\`

## 📱 Implementation
\`\`\`kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AndroidLib.initialize(this)
    }
}
\`\`\`
`;

    case 46:
      return `
# 🔮 GraphQL API Server

A scalable, type-safe GraphQL server built with Apollo and TypeScript.

## 🚀 Getting Started
\`\`\`bash
git clone https://github.com/user/graphql-api.git
cd graphql-api
npm install
npm run dev
\`\`\`

## 📜 Schema Example
\`\`\`graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Query {
  me: User
  feed: [Post!]!
}
\`\`\`

## 🛠️ GraphiQL Playground
Run the server and visit \`http://localhost:4000/graphql\` to interact with the API.
`;

    case 47:
      return `
# 🐹 Go Micro-framework

[![Go Reference](https://pkg.go.dev/badge/github.com/user/go-micro.svg)](https://pkg.go.dev/github.com/user/go-micro)
[![Go Report Card](https://goreportcard.com/badge/github.com/user/go-micro)](https://goreportcard.com/report/github.com/user/go-micro)

Ultra-fast HTTP routing and middleware framework designed for Go 1.21+.

## ⚙️ Install
\`\`\`bash
go get -u github.com/user/go-micro
\`\`\`

## ⚡ Quick Start
\`\`\`go
package main

import "github.com/user/go-micro"

func main() {
    app := micro.New()
    app.Get("/", func(c *micro.Context) error {
        return c.JSON(200, micro.Map{"msg": "Hello"})
    })
    app.Start(":8080")
}
\`\`\`

## 🏎️ Benchmarks
| Framework | Allocations | Nanoseconds/Op |
|-----------|-------------|----------------|
| **Go-Micro** | 0 B/op | 120 ns/op |
`;

    case 48:
      return `
# 🛠️ Vim Plugin (Neovim Lua)

A blazing fast Neovim plugin written in Lua.

## 📦 Installation

Using [lazy.nvim](https://github.com/folke/lazy.nvim):
\`\`\`lua
{
  "username/vim-plugin.nvim",
  config = function()
    require("vim-plugin").setup({
      -- your configuration comes here
    })
  end
}
\`\`\`

Using [Packer](https://github.com/wbthomason/packer.nvim):
\`\`\`lua
use {
  'username/vim-plugin.nvim',
  config = function() require('vim-plugin').setup() end
}
\`\`\`

## ⌨️ Default Keymaps
| Mode | Key | Action |
|------|-----|--------|
| Normal | \`<leader>vp\` | Open plugin window |
`;

    case 49:
      return `# 🧠 Machine Learning Hub

Models, datasets, and training scripts.

## Installation
\`\`\`bash
pip install -r requirements.txt
\`\`\``;

    case 50:
      return `# 🤖 Deep Learning Vision Model

PyTorch implementation of Vision Transformers (ViT).

## Weights
Pre-trained weights can be downloaded from [HuggingFace](#).`;

    case 51:
      return `# 📓 EDA Jupyter Notebooks

Exploratory Data Analysis on financial datasets.

## Running Locally
\`\`\`bash
jupyter lab
\`\`\``;

    case 52:
      return `# 🔄 Data Engineering ETL

Apache Airflow DAGs for scraping, cleaning, and loading data into Snowflake.

## Architecture
S3 -> AWS Glue -> Snowflake`;

    case 53:
      return `# 🗣️ NLP Transformer

Fine-tuned BERT model for Sentiment Analysis.

## Inference
\`\`\`python
from transformers import pipeline
classifier = pipeline("sentiment-analysis")
\`\`\``;

    case 54:
      return `# 👀 Computer Vision Tracker

YOLOv8 implementation for real-time object tracking.

## Real-time demo
\`\`\`bash
python track.py --source 0
\`\`\``;

    case 55:
      return `# 🕷️ Scrapy Toolkit

Distributed web scraping architecture using Scrapy and Redis.

## Run Spider
\`\`\`bash
scrapy crawl products_spider
\`\`\``;

    default:
      return "# Preview\n\nLoading...";
  }
};
