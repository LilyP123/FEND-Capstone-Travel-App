const { getUsername, handleSubmit } = require('../src/client/js/formHandler.js');
const axios = require('axios');

describe('Testing geonames key (username) function', () => {
  test('The function exists', () => {
    expect(getUsername).toBeDefined();
  });
});

describe('Testing handleSubmit function', () => {
  test('The function exists', () => {
    expect(handleSubmit).toBeDefined();
  });
});