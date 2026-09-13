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
  
  // Test SVG rendering
  const svg = organ.renderSVG(100, true);
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Organ '${id}' SVG must be valid SVG markup`);
  
  // Test coordinates
  assert.ok(organ.targetPos.x >= 0 && organ.targetPos.x <= 100, `Organ '${id}' X coordinate must be between 0-100`);
  assert.ok(organ.targetPos.y >= 0 && organ.targetPos.y <= 100, `Organ '${id}' Y coordinate must be between 0-100`);
}
console.log(`✅ All ${expectedOrgans.length} anatomical organs verified with valid SVGs and pedagogical data.`);

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

console.log('\n🎉 ALL ANATOMI TUBUH MANUSIA VERIFICATION TESTS PASSED SUCCESSFULLY! 🩺✨\n');
