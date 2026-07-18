import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function keyFor(profile) {
  return `progress:${profile}`;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const profile = req.query.profile;
    if (!profile) return res.status(400).json({ error: "profile required" });
    const data = await redis.get(keyFor(profile));
    return res.status(200).json(data || null);
  }

  if (req.method === "POST") {
    const { profile, ...partial } = req.body || {};
    if (!profile) return res.status(400).json({ error: "profile required" });
    const existing = (await redis.get(keyFor(profile))) || {};
    const merged = { ...existing, ...partial, updatedAt: Date.now() };
    await redis.set(keyFor(profile), merged);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
