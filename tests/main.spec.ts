import { expect } from 'chai';
import { main } from '../src/main';

describe('main', function () {
  it('should run', function () {
    const result = main();
    expect(result).to.be.ok
  });
});
