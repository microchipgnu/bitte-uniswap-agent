import express from "express";
import cors from "cors";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import { healthRouter } from "./routes/health";
import { uniswapRouter } from "./routes/uniswap";
import { pluginData } from "./plugin";
import path from "path";
import { fileURLToPath } from "url";

config(); // Load .env file

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Root route with API info
app.get("/", (_, res) => {
  res.send(`
    <h1>Bitte Uniswap Agent API</h1>
    <p>Welcome to the Bitte Uniswap Agent API server.</p>
    <ul>
      <li><a href="/docs">API Documentation</a></li>
      <li><a href="/.well-known/ai-plugin.json">OpenAI Plugin Specification</a></li>
    </ul>
    <h2>Available Routes:</h2>
    <ul>
      <li><code>/api/health</code> - Health check endpoint</li>
      <li><code>/api/tools/uniswap</code> - Uniswap integration endpoints</li>
    </ul>
  `);
});

// Routes
app.use("/api/health", healthRouter);
app.use("/api/tools/uniswap", uniswapRouter);

// Expose plugin manifest at /.well-known/ai-plugin.json
app.get("/.well-known/ai-plugin.json", (_, res) => {
  res.json(pluginData);
});

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(pluginData));

// Add this AFTER all your defined routes
app.use((req, res, next) => {
  console.log(`⚠️  No route found for ${req.method} ${req.path}`);
  next();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
