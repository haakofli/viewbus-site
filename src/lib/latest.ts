import fs from "node:fs";
import path from "node:path";

type Platform = { url: string; signature?: string };

type LatestRelease = {
  version: string;
  notes: string;
  url: string;
  installerUrl: string;
  platform: string;
  installerFormat: string;
  signed: boolean;
  publishedAt: string;
  platforms: Partial<{
    "windows-x86_64": Platform;
    "darwin-aarch64": Platform;
  }>;
};

const raw = fs.readFileSync(path.resolve("public/latest.json"), "utf-8");

export const latest: LatestRelease = JSON.parse(raw);
