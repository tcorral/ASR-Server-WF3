/* */ 
const expect = require('chai').expect;
describe.skip(`PRs PLEASE!`, () => {
  const apiCheck = require('./index');
  const apiCheckInstance = apiCheck();
  it(`should not show [Circular] when something is simply used in two places`, () => {
    const y = {foo: 'foo'};
    const x = {
      foo: y,
      bar: y
    };
    const result = apiCheckInstance(apiCheckInstance.string, x);
    expect(result.message).to.not.contain('[Circular]');
  });
});
