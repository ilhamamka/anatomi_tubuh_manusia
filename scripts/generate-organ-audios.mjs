import fs from 'fs';
import path from 'path';

// Extract organ stories from src/organs-data.ts
const content = fs.readFileSync('src/organs-data.ts', 'utf8');

const organRegex = /id:\s*'([a-z0-9_]+)'[\s\S]*?story:\s*'([^']+)'/g;
const items = [];
let m;
while ((m = organRegex.exec(content)) !== null) {
  items.push({ id: m[1], story: m[2] });
}

console.log(`Found ${items.length} items to generate audio for.`);

async function fetchSentenceAudio(text) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=id&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch TTS for: "${text.slice(0, 30)}..." - status: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Split text into safe chunk sentences (< 150 chars each)
function splitIntoChunks(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 160) {
      chunks.push(trimmed);
    } else {
      // Split by commas or spaces
      const parts = trimmed.split(/,\s*/);
      for (const p of parts) {
        if (p.trim()) chunks.push(p.trim());
      }
    }
  }
  return chunks;
}

async function run() {
  for (const item of items) {
    const isCase = item.id.startsWith('case_');
    const outDir = isCase ? 'public/audio/cases' : 'public/audio/organs';
    const outFile = path.join(outDir, `${item.id}.mp3`);
    
    console.log(`Generating audio for ${item.id}...`);
    const chunks = splitIntoChunks(item.story);
    const audioBuffers = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const buf = await fetchSentenceAudio(chunk);
        audioBuffers.push(buf);
        // Small delay to be polite
        await new Promise(r => setTimeout(r, 120));
      } catch (err) {
        console.error(`Error on ${item.id} chunk ${i}:`, err.message);
      }
    }

    if (audioBuffers.length > 0) {
      const combined = Buffer.concat(audioBuffers);
      fs.writeFileSync(outFile, combined);
      console.log(` Saved ${outFile} (${(combined.length / 1024).toFixed(1)} KB)`);
    }
  }
  console.log(' All audio generation completed successfully!');
}

run().catch(console.error);
