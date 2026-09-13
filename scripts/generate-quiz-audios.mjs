import fs from 'fs';
import path from 'path';
import { MEDICAL_QUESTIONS } from '../src/questions-engine.ts';

console.log(`Found ${MEDICAL_QUESTIONS.length} questions to generate audio for.`);

const outDir = 'public/audio/quiz';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function fetchSentenceAudio(text) {
  const clean = text.replace(/O2/gi, 'oksigen').replace(/CO2/gi, 'karbon dioksida').replace(/\.\.\./g, '');
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=id&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch TTS: status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function run() {
  for (const q of MEDICAL_QUESTIONS) {
    const outFile = path.join(outDir, `${q.id}.mp3`);
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
      console.log(`- ${q.id}.mp3 already exists`);
      continue;
    }
    console.log(`Generating audio for ${q.id}: "${q.question.slice(0, 45)}..."`);
    try {
      const buf = await fetchSentenceAudio(q.question);
      fs.writeFileSync(outFile, buf);
      console.log(`  Saved ${outFile} (${buf.length} bytes)`);
      await new Promise(r => setTimeout(r, 120));
    } catch (err) {
      console.error(`  Error on ${q.id}:`, err.message);
    }
  }

  // Also generate words for distinct options so option buttons have audio!
  const wordsDir = 'public/audio/words';
  if (!fs.existsSync(wordsDir)) {
    fs.mkdirSync(wordsDir, { recursive: true });
  }

  const allWords = new Set();
  for (const q of MEDICAL_QUESTIONS) {
    for (const opt of q.options) {
      allWords.add(opt.trim());
    }
  }
  console.log(`Generating audio for ${allWords.size} distinct quiz option words...`);

  for (const word of allWords) {
    const safeName = word.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const wordFile = path.join(wordsDir, `${safeName}.mp3`);
    if (fs.existsSync(wordFile) && fs.statSync(wordFile).size > 500) {
      continue;
    }
    try {
      const buf = await fetchSentenceAudio(word);
      fs.writeFileSync(wordFile, buf);
      console.log(`  Saved option word: ${safeName}.mp3`);
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`  Error on word "${word}":`, err.message);
    }
  }

  console.log('All Quiz audio & option words generated successfully!');
}

run().catch(console.error);
