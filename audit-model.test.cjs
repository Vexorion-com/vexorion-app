const assert = require('node:assert/strict');
const VX = require('./audit-model.js');
let count = 0;
function test(name, fn) {
  fn();
  console.log(`✓ ${name}`);
  count++;
}

test('The catalog covers 18 areas and 518 illustrative checks', () => {
  assert.equal(VX.domains.length, 18);
  assert.equal(VX.domains.reduce((sum, d) => sum + d.checks, 0), 518);
});
test('The sample workspace has unique findings and a searchable inventory', () => {
  const data = VX.seed();
  assert.equal(data.findings.length, 42);
  assert.equal(new Set(data.findings.map(f => f.id)).size, 42);
  assert.equal(VX.open(data).length, 24);
  assert.equal(VX.resources.length, 1248);
  for (const f of data.findings) {
    assert.ok(VX.domains.some(d => d.id === f.domain));
    assert.ok(VX.XP[f.severity]);
    assert.ok(!f.assignee || data.members.some(m => m.id === f.assignee));
    if (f.status !== 'resolved') assert.ok(VX.resources.some(r => r.name === f.resource));
  }
});
test('Resolution requires an owner and verified remediation without partial mutation', () => {
  const data = VX.seed();
  const original = JSON.stringify(data);
  assert.throws(() => VX.update(data, 'VX-1044', {status:'resolved', assignee:null, verified:true}));
  assert.throws(() => VX.update(data, 'VX-1042', {status:'resolved', assignee:'alex', verified:false}));
  assert.equal(JSON.stringify(data), original);
});
test('Invalid status or engineer is rejected', () => {
  const data = VX.seed();
  assert.throws(() => VX.update(data, 'VX-1042', {status:'deleted', assignee:'alex'}));
  assert.throws(() => VX.update(data, 'VX-1042', {status:'open', assignee:'unknown'}));
});
test('Verified remediation rewards the assigned engineer and improves posture', () => {
  const data = VX.seed();
  const before = VX.memberXP(data, 'sarah');
  const beforeScore = VX.score(data);
  const result = VX.update(data, 'VX-1042', {status:'resolved', assignee:'sarah', verified:true});
  assert.equal(result.awarded, 200);
  assert.equal(VX.memberXP(data, 'sarah'), before + 200);
  assert.equal(VX.open(data).length, 23);
  assert.ok(VX.score(data) > beforeScore);
});
test('Repeated saves cannot create duplicate XP', () => {
  const data = VX.seed();
  VX.update(data, 'VX-1042', {status:'resolved', assignee:'alex', verified:true});
  const before = VX.memberXP(data, 'alex');
  assert.equal(VX.update(data, 'VX-1042', {status:'resolved', assignee:'alex'}).awarded, 0);
  assert.equal(VX.memberXP(data, 'alex'), before);
});
test('Reopening suspends XP and re-resolution restores its original owner and date', () => {
  const data = VX.seed();
  const alex = VX.memberXP(data, 'alex');
  const sarah = VX.memberXP(data, 'sarah');
  VX.update(data, 'VX-1042', {status:'resolved', assignee:'alex', verified:true}, '2026-11-13T09:00:00Z');
  VX.update(data, 'VX-1042', {status:'open', assignee:'sarah'});
  assert.equal(VX.memberXP(data, 'alex'), alex);
  VX.update(data, 'VX-1042', {status:'resolved', assignee:'sarah', verified:true}, '2026-11-20T09:00:00Z');
  assert.equal(VX.memberXP(data, 'alex'), alex + 200);
  assert.equal(VX.memberXP(data, 'sarah'), sarah);
  assert.equal(data.ledger['VX-1042'].at, '2026-11-13T09:00:00Z');
});
test('Changing ownership alone does not award or transfer credit', () => {
  const data = VX.seed();
  const before = VX.memberXP(data, 'alex');
  VX.update(data, 'VX-1042', {status:'in_progress', assignee:'sarah'});
  VX.update(data, 'VX-1001', {status:'resolved', assignee:'sarah'});
  assert.equal(VX.memberXP(data, 'alex'), before);
  assert.ok(!data.ledger['VX-1042']);
});
test('Reports preserve independent copies of statuses, assignees and selected scope', () => {
  const data = VX.seed();
  const report = VX.snapshot(data, ['identity']);
  assert.equal(report.domains.length, 1);
  assert.equal(report.checks, 38);
  assert.ok(report.findings.every(f => f.domain === 'identity'));
  VX.update(data, 'VX-1042', {status:'resolved', assignee:'sarah', verified:true});
  const finding = report.findings.find(f => f.id === 'VX-1042');
  assert.equal(finding.status, 'in_progress');
  assert.equal(finding.assigneeName, 'Alex Morgan');
});
test('Missing or invalid local data falls back to a fresh sample workspace', () => {
  assert.equal(VX.load({getItem: () => '{broken'}).findings.length, 42);
  assert.equal(VX.load({getItem: () => null}).version, 2);
});
console.log(`\n${count} checks passed.`);
