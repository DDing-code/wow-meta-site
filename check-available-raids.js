const axios = require('axios');

async function checkAvailableRaids() {
  try {
    // Get token
    const tokenRes = await axios.post('https://www.warcraftlogs.com/oauth/token', {
      grant_type: 'client_credentials',
      client_id: 'f0ee4d23-f49d-4a8c-b8e2-09ca07035bc4',
      client_secret: 'YsjWHLFCeXLgp0Zst7nfJOPzMqwB1jLfBhU8rLPO'
    });

    const token = tokenRes.data.access_token;
    console.log('Token acquired successfully');

    // Query for latest raid zones
    const query = `
      query {
        worldData {
          zones {
            id
            name
            expansion {
              name
            }
            encounters {
              id
              name
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      { query },
      { headers: { Authorization: `Bearer ${token}` }}
    );

    const zones = response.data.data.worldData.zones;

    // Filter for latest expansion raids
    const latestRaids = zones.filter(z =>
      z.expansion && z.expansion.name === 'The War Within' &&
      z.encounters && z.encounters.length > 0
    );

    console.log('\n=== Available Raids in The War Within ===');
    latestRaids.forEach(zone => {
      console.log(`\nZone ID: ${zone.id} - ${zone.name}`);
      console.log(`Number of Bosses: ${zone.encounters.length}`);
      console.log('Boss List:');
      zone.encounters.forEach(boss => {
        console.log(`  - ${boss.name} (ID: ${boss.id})`);
      });
    });

    // Check for any zones with "Manaforge" in the name
    const manaforgeZones = zones.filter(z =>
      z.name && z.name.toLowerCase().includes('manaforge')
    );

    if (manaforgeZones.length > 0) {
      console.log('\n=== Manaforge Zones Found ===');
      manaforgeZones.forEach(zone => {
        console.log(`Zone ID: ${zone.id} - ${zone.name}`);
        if (zone.expansion) {
          console.log(`Expansion: ${zone.expansion.name}`);
        }
      });
    } else {
      console.log('\n⚠️ No Manaforge zones found in current data');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

checkAvailableRaids();