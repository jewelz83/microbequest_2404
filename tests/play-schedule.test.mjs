import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleAllowsPlay } from '../src/services/gameAccessPolicy.mjs';
const controls = { screenTimeEnabled: true, allowedDays: ['friday'], allowedStartTime: '08:00', allowedEndTime: '20:00' };
const friday = (hour, minute = 0) => new Date(2026, 9, 23, hour, minute);
test('schedule includes opening minute, excludes closing minute and disallowed days', () => {
  assert.equal(scheduleAllowsPlay(controls, friday(7,59)), false);
  assert.equal(scheduleAllowsPlay(controls, friday(8)), true);
  assert.equal(scheduleAllowsPlay(controls, friday(19,59)), true);
  assert.equal(scheduleAllowsPlay(controls, friday(20)), false);
  assert.equal(scheduleAllowsPlay(controls, new Date(2026,9,24,12)), false);
  assert.equal(scheduleAllowsPlay({...controls, allowedDays:[]}, friday(12)), false);
});
test('overnight windows use the starting day, including week rollover', () => {
  const overnight = {...controls, allowedStartTime:'22:00', allowedEndTime:'02:00'};
  assert.equal(scheduleAllowsPlay(overnight, friday(22)), true);
  assert.equal(scheduleAllowsPlay(overnight, new Date(2026,9,24,1,59)), true);
  assert.equal(scheduleAllowsPlay(overnight, new Date(2026,9,24,2)), false);
  assert.equal(scheduleAllowsPlay(overnight, friday(1)), false);
  assert.equal(scheduleAllowsPlay({...overnight,allowedDays:['saturday']},new Date(2026,9,25,1)),true);
});
test('disabled scheduling permits play; invalid or empty windows deny play', () => {
  assert.equal(scheduleAllowsPlay({screenTimeEnabled:false},friday(0)),true);
  for (const change of [{allowedStartTime:'bad'},{allowedEndTime:'24:00'},{allowedEndTime:'08:00'},{allowedDays:null},{screenTimeEnabled:null}]) {
    assert.equal(scheduleAllowsPlay({...controls,...change},friday(12)),false);
  }
  assert.equal(scheduleAllowsPlay(controls,new Date('invalid')),false);
});
