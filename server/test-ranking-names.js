const warcraftLogsClient = require('./warcraftlogs-client');

// Test the ranking data generation
const rankings = warcraftLogsClient.generateTopRankingData('warrior', 'fury');

console.log('First 5 players from rankings:');
rankings.slice(0, 5).forEach(r => {
  console.log(`${r.rank}. ${r.name} (${r.guild}) - DPS: ${r.dps.toLocaleString()}`);
});