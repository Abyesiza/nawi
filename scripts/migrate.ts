import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);

  const dir = path.join(process.cwd(), "drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const full = path.join(dir, file);
    const raw = readFileSync(full, "utf8");
    // Drizzle uses `--> statement-breakpoint` between statements
    const statements = raw
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(`\n→ Applying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await sql.query(stmt);
        process.stdout.write(".");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (
          msg.includes("already exists") ||
          msg.includes("duplicate")
        ) {
          process.stdout.write("·");
        } else {
          console.error(`\n✗ Statement failed:\n${stmt.slice(0, 200)}\n→ ${msg}`);
          throw e;
        }
      }
    }
    console.log(" done");
  }
  console.log("\nAll migrations applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
