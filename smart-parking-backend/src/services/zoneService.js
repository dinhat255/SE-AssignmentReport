const parkingSpotRepository = require('../repositories/parkingSpotRepository');

function getZonesStatus() {
  const zones = {};
  for (const spot of parkingSpotRepository.list()) {
    zones[spot.zone] ||= { zone: spot.zone, available: 0, occupied: 0, maintenance: 0, total: 0 };
    zones[spot.zone].total += 1;
    if (spot.status === 'AVAILABLE') zones[spot.zone].available += 1;
    else if (spot.status === 'MAINTENANCE') zones[spot.zone].maintenance += 1;
    else zones[spot.zone].occupied += 1;
  }
  return Object.values(zones).map((zone) => ({
    ...zone,
    status: zone.total === 0
      ? 'UNKNOWN'
      : zone.available === 0
        ? 'FULL'
        : zone.available <= Math.max(1, Math.ceil(zone.total * 0.2))
          ? 'NEARLY_FULL'
          : 'AVAILABLE',
  }));
}

module.exports = { getZonesStatus };
