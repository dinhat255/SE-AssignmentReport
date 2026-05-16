const parkingSpots = require('../data/parkingSpots.data');

function list() {
  return parkingSpots;
}

function findById(id) {
  return parkingSpots.find((spot) => spot.id === id) || null;
}

function updateStatus(id, status) {
  const spot = findById(id);
  if (spot) spot.status = status;
  return spot;
}

module.exports = { list, findById, updateStatus };
