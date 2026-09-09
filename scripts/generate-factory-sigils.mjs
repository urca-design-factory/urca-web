import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const source = new URL("../updated-morph/", import.meta.url);
const output = new URL("../public/sigils/", import.meta.url);
const shapes = JSON.parse(await readFile(new URL("shapes.json", source), "utf8"));

await mkdir(output, { recursive: true });
for (const { name } of shapes) {
  const stage = name.toLowerCase();
  await copyFile(new URL(`${stage}.svg`, source), new URL(`factory-${stage}.svg`, output));
}
await writeFile(
  new URL("../components/factory-sigil-data.json", import.meta.url),
  JSON.stringify(Object.fromEntries(shapes.map(({ name, points }) => [name.toLowerCase(), points])),
    (_, value) => typeof value === "number" ? Number(value.toFixed(8)) : value) + "\n",
);
