/* eslint-disable no-undef */
'use strict'

const {
  BinarioADecimal,
  DecimalABinario,
} = require('../homework.js');

describe('BinarioADecimal(num)', function() {
  it('should return 2', function() {
    expect(BinarioADecimal('10')).toBe(2);
  });
  it('should return 7', function() {
    expect(BinarioADecimal('111')).toBe(7);
  });
});

describe('DecimalABinario(num)', function() {
  it('should return "100"', function() {
    expect(DecimalABinario(4)).toBe('100');
  });
  it('should return "111"', function() {
    expect(DecimalABinario(7)).toBe('111');
  });
});
