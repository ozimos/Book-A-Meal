/* eslint import/no-extraneous-dependencies: off */

require('babel-core/register');

module.exports = (settings => settings)(require('./nightwatch.json'));
