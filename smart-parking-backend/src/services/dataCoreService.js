function enrichUser(user) {
  return {
    ...user,
    dataCoreSynced: true,
  };
}

module.exports = { enrichUser };
