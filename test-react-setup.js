// Quick test to verify React setup
import { createRequire } from "module";
const require = createRequire(import.meta.url);

console.log("Testing React setup...\n");

try {
  const reactPkg = require("./client/node_modules/react/package.json");
  const reactDomPkg = require("./client/node_modules/react-dom/package.json");
  const vitePkg = require("./client/node_modules/vite/package.json");
  const pluginPkg = require("./client/node_modules/@vitejs/plugin-react/package.json");

  console.log("✅ React version:", reactPkg.version);
  console.log("✅ React-DOM version:", reactDomPkg.version);
  console.log("✅ Vite version:", vitePkg.version);
  console.log("✅ Vite React Plugin version:", pluginPkg.version);

  console.log("\n📋 Checking compatibility...");

  const reactMajor = parseInt(reactPkg.version.split(".")[0]);
  const viteMajor = parseInt(vitePkg.version.split(".")[0]);

  if (reactMajor === 19 && viteMajor >= 5) {
    console.log(
      "✅ React 19 + Vite 5+ detected - should work with automatic JSX runtime"
    );
  }

  console.log("\n✅ All packages installed correctly");
  console.log("\n🔧 Next steps:");
  console.log("1. Stop dev server (Ctrl+C)");
  console.log("2. Delete cache: rmdir /s /q client\\node_modules\\.vite");
  console.log("3. Restart: cd client && npm run dev");
  console.log("4. Hard refresh browser: Ctrl+Shift+R");
} catch (error) {
  console.error("❌ Error:", error.message);
  console.log("\n🔧 Try reinstalling:");
  console.log("cd client");
  console.log("npm install");
}
