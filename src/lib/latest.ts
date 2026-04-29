import fs from "node:fs";
import path from "node:path";

type LatestRelease = {
  version: string;
  notes: string;
  url: string;
  installerUrl: string;
  platform: string;
  installerFormat: string;
  signed: boolean;
  publishedAt: string;
  platforms: {
    "windows-x86_64": { url: string };
    "darwin-aarch64": { url: string };
  };
};

const raw = fs.readFileSync(path.resolve("public/latest.json"), "utf-8");

export const latest: LatestRelease = JSON.parse(raw);
