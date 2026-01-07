import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const clientDir = "./client";
let fixedCount = 0;
let skippedCount = 0;

function getAllJsxFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== "dist") {
        getAllJsxFiles(filePath, fileList);
      }
    } else if (file.endsWith(".jsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function fixReactImport(filePath) {
  try {
    let content = readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    // Check if React is already imported
    const hasReactImport = lines.some(
      (line) =>
        line.trim().startsWith("import React") || line.includes("import React,")
    );

    if (hasReactImport) {
      console.log(`⏭️  Skipped (already has React): ${filePath}`);
      skippedCount++;
      return;
    }

    // Find the first import from 'react'
    const reactImportIndex = lines.findIndex(
      (line) => line.includes('from "react"') || line.includes("from 'react'")
    );

    if (reactImportIndex === -1) {
      console.log(`⏭️  Skipped (no react import): ${filePath}`);
      skippedCount++;
      return;
    }

    // Modify the import line
    const originalLine = lines[reactImportIndex];

    if (originalLine.includes("import {")) {
      // Change: import { ... } from "react"
      // To: import React, { ... } from "react"
      lines[reactImportIndex] = originalLine.replace(
        "import {",
        "import React, {"
      );
    } else if (originalLine.includes("import ")) {
      // Already has some import, skip
      console.log(`⏭️  Skipped (complex import): ${filePath}`);
      skippedCount++;
      return;
    }

    // Write back
    writeFileSync(filePath, lines.join("\n"), "utf8");
    console.log(`✅ Fixed: ${filePath}`);
    fixedCount++;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log("🔧 Fixing React imports in all JSX files...\n");

const jsxFiles = getAllJsxFiles(clientDir);
console.log(`Found ${jsxFiles.length} JSX files\n`);

jsxFiles.forEach(fixReactImport);

console.log(`\n📊 Summary:`);
console.log(`✅ Fixed: ${fixedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`\n🎉 Done! Now restart dev server.`);
