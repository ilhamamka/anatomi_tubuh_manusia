// Native assert-based verification test for Anatomi Tubuh Manusia game logic & data
import assert from 'node:assert/strict';

console.log('🧪 Running Anatomi Tubuh Manusia Verification Tests...');

// 1. Verify Organ Dataset
import { ORGANS, CURRICULUM_LEVELS, CLINICAL_CASES } from './src/organs-data.ts';

const expectedOrgans = [
  'brain', 'heart', 'lungs', 'stomach', 'liver', 'intestines', 
  'kidneys', 'skeleton', 'blood_cells', 'senses_eye', 'senses_ear', 'senses_skin'
];

for (const id of expectedOrgans) {
  const organ = ORGANS[id];
  assert.ok(organ, `Organ '${id}' must exist in dataset`);
  assert.ok(organ.name.length > 0, `Organ '${id}' must have a name`);
  assert.ok(organ.latinName.length > 0, `Organ '${id}' must have a latinName`);
  assert.ok(organ.summary.length > 10, `Organ '${id}' must have an informative summary`);
  assert.ok(organ.funFacts.length >= 2, `Organ '${id}' must have at least 2 fun facts`);
  assert.ok(organ.healthTips.length > 5, `Organ '${id}' must have health tips`);
  assert.ok(organ.story && organ.story.length > 30, `Organ '${id}' must have an engaging kid-friendly story text`);
  
  // Test SVG rendering
  const svg = organ.renderSVG(100, true);
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Organ '${id}' SVG must be valid SVG markup`);
  
  // Test coordinates
  assert.ok(organ.targetPos.x >= 0 && organ.targetPos.x <= 100, `Organ '${id}' X coordinate must be between 0-100`);
  assert.ok(organ.targetPos.y >= 0 && organ.targetPos.y <= 100, `Organ '${id}' Y coordinate must be between 0-100`);

  // Test clinical telemetry metrics
  assert.ok(organ.clinicalMetrics, `Organ '${id}' must have clinical metrics`);
  const metricKeys = Object.keys(organ.clinicalMetrics);
  assert.ok(metricKeys.length >= 2, `Organ '${id}' must have at least 2 clinical metrics`);
  for (const k of metricKeys) {
    assert.ok(k && organ.clinicalMetrics[k], `Metric '${k}' in '${id}' must have label and value`);
  }
}
// Check realistic renders presence across ALL 12 organs
for (const id of expectedOrgans) {
  assert.ok(ORGANS[id].realisticImage, `Organ '${id}' must have realisticImage defined`);
}
console.log(`✅ All ${expectedOrgans.length} anatomical organs verified with 3D clinical metrics & photorealistic renders.`);

// 2. Verify Curriculum Levels
assert.equal(CURRICULUM_LEVELS.length, 5, 'Must have exactly 5 curriculum levels');
assert.equal(CURRICULUM_LEVELS[0].isLockedDefault, false, 'Level 1 must be free demo');
assert.equal(CURRICULUM_LEVELS[1].isLockedDefault, false, 'Level 2 must be free demo');
assert.equal(CURRICULUM_LEVELS[2].isLockedDefault, true, 'Level 3 must be VIP gated');
assert.equal(CURRICULUM_LEVELS[3].isLockedDefault, true, 'Level 4 must be VIP gated');
assert.equal(CURRICULUM_LEVELS[4].isLockedDefault, true, 'Level 5 must be VIP gated');
console.log('✅ 5 Curriculum progression levels and freemium defaults verified.');

// 3. Verify Clinical Pediatric Cases
assert.equal(CLINICAL_CASES.length, 6, 'Must have 6 clinical diagnosis cases');
for (const c of CLINICAL_CASES) {
  assert.ok(c.patientName, 'Case must have patient name');
  assert.ok(c.chiefComplaint, 'Case must have chief complaint');
  assert.ok(ORGANS[c.correctOrganId], `Case correctOrganId '${c.correctOrganId}' must exist in organs dictionary`);
  assert.ok(['stethoscope', 'xray', 'thermometer'].includes(c.examinationTool), 'Examination tool must be valid');
}
console.log('✅ 6 Pediatric clinical cases verified.');

// 4. Verify Leaderboard Rank Formulas
import { getRankTitle } from './src/leaderboard.ts';
assert.equal(getRankTitle(200), '🌱 Dokter Magang Cilik');
assert.equal(getRankTitle(800), '🌟 Dokter Residen Cilik');
assert.equal(getRankTitle(2000), '🥼 Dokter Umum Cilik');
assert.equal(getRankTitle(3500), '🩺 Spesialis Bedah Cilik');
assert.equal(getRankTitle(6000), '🏆 Profesor Anatomi Indonesia');
console.log('✅ Medical rank title calculations verified.');

// 5. Verify Commercial Licensing Engine
import { commercial } from './src/commercial.ts';
assert.equal(commercial.isLevelLocked(1), false, 'Level 1 is unlocked');
assert.equal(commercial.isLevelLocked(2), false, 'Level 2 is unlocked');
assert.equal(commercial.isLevelLocked(3), true, 'Level 3 is locked initially');

const wrongCodeRes = commercial.activateWithCode('WRONG-CODE-123');
assert.equal(wrongCodeRes.success, false, 'Invalid code must fail');

const validCodeRes = commercial.activateWithCode('ANATOMI-VIP-2026');
assert.equal(validCodeRes.success, true, 'Valid code must succeed');
assert.equal(commercial.hasVipAccess(), true, 'Commercial state must be VIP');
assert.equal(commercial.isLevelLocked(3), false, 'Level 3 unlocked after VIP');
assert.equal(commercial.isLevelLocked(5), false, 'Level 5 unlocked after VIP');
console.log('✅ Commercial activation codes and freemium gate logic verified.');

// 6. Verify Custom Icons Suite
import { ICONS, renderBrandLogo } from './src/icons.ts';
const requiredIcons = ['stethoscope', 'heart', 'lungs', 'brain', 'bone', 'microscope', 'chart', 'sandbox', 'trophy', 'guide', 'print', 'vip', 'sound', 'music', 'fullscreen'];
for (const icon of requiredIcons) {
  assert.ok(typeof ICONS[icon] === 'function', `Icon '${icon}' must exist in ICONS dictionary`);
  const svg = ICONS[icon](24);
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Icon '${icon}' must return valid SVG markup`);
}
const brandLogo = renderBrandLogo();
assert.ok(brandLogo.includes('ANATOMI TUBUH KITA'), 'Brand logo must render proper title');
console.log('✅ Custom vector SVG icon suite verified.');

// 7. Verify Audio Engine Lifecycle & Component Cleanups
import { sound } from './src/audio.ts';
import { BodyScannerGame } from './src/game-scanner.ts';
import { AnatomyChartManager } from './src/anatomy-chart.ts';
import { OrganAssemblyGame } from './src/game-assembly.ts';
import { ClinicGame } from './src/game-clinic.ts';
import { SandboxManager } from './src/sandbox.ts';

assert.equal(typeof sound.stopSpeaking, 'function', 'sound.stopSpeaking must exist');
assert.equal(typeof sound.stopAll, 'function', 'sound.stopAll must exist');
assert.equal(typeof sound.onSpeakingChange, 'function', 'sound.onSpeakingChange must exist');
assert.equal(typeof sound.toggleAutoNarration, 'function', 'sound.toggleAutoNarration must exist');
assert.equal(typeof sound.isAutoNarrationEnabled, 'function', 'sound.isAutoNarrationEnabled must exist');

assert.equal(typeof sound.playNaturalAudioClip, 'function', 'sound.playNaturalAudioClip must exist');
assert.equal(typeof sound.playNaturalSpeech, 'function', 'sound.playNaturalSpeech must exist');
assert.equal(typeof sound.speakPraise, 'function', 'sound.speakPraise must exist');
assert.equal(typeof sound.speakStory, 'function', 'sound.speakStory must exist');

// Verify audio asset files exist on disk
import fs from 'node:fs';
for (const id of expectedOrgans) {
  assert.ok(fs.existsSync(`public/audio/organs/${id}.mp3`), `public/audio/organs/${id}.mp3 must exist on disk`);
  const size = fs.statSync(`public/audio/organs/${id}.mp3`).size;
  assert.ok(size > 10000, `Audio file for ${id} must have audio content (> 10KB), got ${size} bytes`);
}

for (const c of CLINICAL_CASES) {
  assert.ok(fs.existsSync(`public/audio/cases/${c.id}.mp3`), `public/audio/cases/${c.id}.mp3 must exist on disk`);
}

for (let i = 1; i <= 30; i++) {
  assert.ok(fs.existsSync(`public/audio/quiz/mq${i}.mp3`), `public/audio/quiz/mq${i}.mp3 must exist on disk`);
}

const praises = ['bagus', 'hebat', 'juara', 'keren', 'pintar', 'luar_biasa'];
for (const p of praises) {
  assert.ok(fs.existsSync(`public/audio/id/${p}.mp3`), `public/audio/id/${p}.mp3 must exist on disk`);
}

console.log('✅ Natural audio files (12 organs + 6 cases + 6 praises) verified on disk.');
// 8. Verify Kurikulum Merdeka Medical Quiz Bank
import { MEDICAL_QUESTIONS } from './src/questions-engine.ts';
assert.ok(MEDICAL_QUESTIONS.length >= 30, `Must have at least 30 quiz questions, got ${MEDICAL_QUESTIONS.length}`);

const tierCounts = { 1: 0, 2: 0, 3: 0 };
for (const q of MEDICAL_QUESTIONS) {
  assert.ok([1, 2, 3].includes(q.tier), `Question ${q.id} must have tier 1, 2, or 3`);
  tierCounts[q.tier]++;
  assert.ok(q.curriculumStandard && q.curriculumStandard.length > 5, `Question ${q.id} must specify curriculum standard`);
  assert.ok(q.question && q.question.length > 10, `Question ${q.id} must have question text`);
  assert.equal(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `Question ${q.id} correctIndex must be 0-3`);
  assert.ok(q.explanation && q.explanation.length > 10, `Question ${q.id} must have explanation`);
  assert.ok(q.xpReward >= 25, `Question ${q.id} must reward >= 25 XP`);
}
assert.ok(tierCounts[1] >= 10, 'Must have at least 10 Tier 1 questions');
assert.ok(tierCounts[2] >= 10, 'Must have at least 10 Tier 2 questions');
assert.ok(tierCounts[3] >= 10, 'Must have at least 10 Tier 3 questions');
console.log(`✅ 30 Kurikulum Merdeka medical questions verified across Tiers 1, 2, and 3.`);

// 9. Verify Physiology Pathway Simulator
import { PATHWAYS } from './src/physiology-flow.ts';
const expectedPathways = ['digestion', 'circulation', 'respiration'];
for (const pid of expectedPathways) {
  const p = PATHWAYS[pid];
  assert.ok(p, `Pathway '${pid}' must exist`);
  assert.ok(p.title && p.title.length > 0, `Pathway '${pid}' must have title`);
  assert.ok(p.curriculumBadge && p.curriculumBadge.length > 0, `Pathway '${pid}' must have curriculumBadge`);
  assert.ok(p.steps.length >= 4, `Pathway '${pid}' must have at least 4 steps`);
  for (const s of p.steps) {
    assert.ok(s.stepNumber > 0, 'Step must have stepNumber');
    assert.ok(s.organName, 'Step must have organName');
    assert.ok(s.summary, 'Step must have summary');
    assert.ok(s.narration, 'Step must have kid narration');
    assert.ok(s.posX >= 0 && s.posX <= 100, 'Step posX must be 0-100');
    assert.ok(s.posY >= 0 && s.posY <= 100, 'Step posY must be 0-100');
  }
}
console.log('✅ 3 Interactive physiology pathways (Pencernaan, Sirkulasi, Pernapasan) verified.');

// 10. Verify Commercial Plans, WhatsApp Checkout & Parental Gate
import { COMMERCIAL_PLANS } from './src/commercial.ts';
assert.equal(COMMERCIAL_PLANS.length, 2, 'Must have 2 commercial plans (Personal & School)');
assert.equal(COMMERCIAL_PLANS[0].id, 'personal');
assert.equal(COMMERCIAL_PLANS[1].id, 'school');
assert.equal(COMMERCIAL_PLANS[0].price, 'Rp 49.000');
assert.equal(COMMERCIAL_PLANS[1].price, 'Rp 149.000');

const waUrl = commercial.getWhatsAppOrderUrl('personal', 'Budi Santoso');
assert.ok(waUrl.includes('api.whatsapp.com'), 'WhatsApp URL must target api.whatsapp.com');
assert.ok(waUrl.includes('Rp%2049.000') || waUrl.includes('Rp 49.000'), 'WhatsApp URL must include plan price');

const challenge = commercial.generateParentalChallenge();
assert.ok(challenge.question.includes('×'), 'Parental challenge must have arithmetic question');
assert.equal(commercial.verifyParentalChallenge(999999), false, 'Incorrect answer must fail challenge');
assert.equal(commercial.verifyParentalChallenge(challenge.answer), true, 'Correct answer must pass challenge');

commercial.setScreenTimeLimit(30);
assert.equal(commercial.getScreenTimeLimit(), 30, 'Screen time limit should be 30 mins');
commercial.setScreenTimeLimit(0);
assert.equal(commercial.getScreenTimeLimit(), 0, 'Screen time limit should be unlimited (0)');
console.log('✅ Commercial plans (Personal & School), WhatsApp sales link, and Parental Gate verified.');

// 11. Verify New Icons in Suite
assert.ok(typeof ICONS.quiz === 'function', 'quiz icon must exist');
assert.ok(typeof ICONS.flow === 'function', 'flow icon must exist');
assert.ok(ICONS.quiz(20).includes('<svg'), 'quiz icon must render valid SVG');
assert.ok(ICONS.flow(20).includes('<svg'), 'flow icon must render valid SVG');
console.log('✅ New quiz and flow SVG icons verified.');

// 12. Verify Curriculum Quest Engine (5-Step Mission Journey)
import { CurriculumQuestRunner } from './src/curriculum-quest.ts';
for (let lvl = 1; lvl <= 5; lvl++) {
  const runner = new CurriculumQuestRunner(lvl, {
    onComplete: () => {},
    onExit: () => {},
    onGoToWorksheets: () => {}
  });
  assert.ok(runner, `CurriculumQuestRunner for Level ${lvl} must instantiate successfully`);
}
console.log('✅ CurriculumQuestRunner verified across all 5 curriculum levels.');

// 13. Verify Option Visual Icon Helper (Kids icon-based quiz)
import { getOptionIcon } from './src/questions-engine.ts';
assert.equal(getOptionIcon('Jantung'), '🫀');
assert.equal(getOptionIcon('Lambung'), '🥣');
assert.equal(getOptionIcon('Paru-paru'), '🫁');
assert.equal(getOptionIcon('Otak'), '🧠');
assert.equal(getOptionIcon('Ginjal'), '🫘');
assert.equal(getOptionIcon('Mata'), '👁️');
console.log('✅ Option visual icon helper getOptionIcon verified.');

// 14. Verify Atlas 4-Layer Body Peeler & Interactive Tools
import { BODY_LAYERS } from './src/anatomy-chart.ts';
assert.equal(BODY_LAYERS.length, 4, 'Must have exactly 4 body layers (Kulit, Otot, Rangka, Organ)');
assert.equal(BODY_LAYERS[0].id, 'kulit');
assert.equal(BODY_LAYERS[1].id, 'otot');
assert.equal(BODY_LAYERS[2].id, 'rangka');
assert.equal(BODY_LAYERS[3].id, 'organ');
for (const layer of BODY_LAYERS) {
  assert.ok(layer.name.length > 0, `Layer ${layer.id} must have a name`);
  assert.ok(layer.icon.length > 0, `Layer ${layer.id} must have an icon`);
  assert.ok(layer.bgImage.length > 0, `Layer ${layer.id} must have a bgImage`);
  assert.ok(layer.touchpoints.length >= 3, `Layer ${layer.id} must have at least 3 touchpoints`);
}
console.log('✅ Atlas 4-Layer Body Peeler & interactive touchpoints verified.');

console.log('\n🎉 ALL ANATOMI TUBUH MANUSIA VERIFICATION TESTS PASSED SUCCESSFULLY! 🩺✨\n');
