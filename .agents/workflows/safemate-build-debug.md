---
description: Build and Debug Safe Mate Web App
---

# Safe Mate - Build & Debug Workflow

This workflow contains the exact steps to install dependencies, run the development server, and build the Safe Mate application for production.

// turbo-all

1. Navigate to the project directory and install dependencies.
```bash
cd 'd:\prehackclaude\safemate'
npm install
```

2. Run the build to verify there are no compilation errors.
```bash
cd 'd:\prehackclaude\safemate'
npm run build
```

3. Start the development server (in the background, wait 5 seconds before moving on)
```bash
cd 'd:\prehackclaude\safemate'
npm run dev
```

> **Note on Chatbot API**: The `ChatBotModal.jsx` file contains a placeholder `setTimeout` promise where the actual LLM API endpoint should be inserted in the future.
