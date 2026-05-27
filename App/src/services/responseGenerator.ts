const responses: Record<string, string[]> = {
  yes: ['Yes!', 'Okay!', 'Sure!', 'Got it!'],
  no: ['No.', 'Understood.', 'Alright.'],
  up: ['Going up!', 'Upward!', 'Rising!'],
  down: ['Going down!', 'Downward!', 'Lowering!'],
  left: ['To the left!', 'Left!', 'Turning left!'],
  right: ['To the right!', 'Right!', 'Turning right!'],
  stop: ['Stopped!', 'Halting!', 'Paused!'],
  go: ['Going!', 'Moving!', 'Forward!'],
  on: ['Turning on!', 'Activated!', 'On!'],
  off: ['Turning off!', 'Deactivated!', 'Off!'],
  zero: ['Zero.', 'Number zero.'],
  one: ['One.', 'Number one.'],
  two: ['Two.', 'Number two.'],
  three: ['Three.', 'Number three.'],
  four: ['Four.', 'Number four.'],
  five: ['Five.', 'Number five.'],
  six: ['Six.', 'Number six.'],
  seven: ['Seven.', 'Number seven.'],
  eight: ['Eight.', 'Number eight.'],
  nine: ['Nine.', 'Number nine.'],
};

export function getResponse(word: string): string {
  const pool = responses[word];
  if (!pool) return `I heard ${word}.`;
  return pool[Math.floor(Math.random() * pool.length)];
}
