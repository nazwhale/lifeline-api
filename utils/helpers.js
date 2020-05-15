function getISOTimestamp() {
  const unformatted = new Date();
  return unformatted.toISOString();
}

module.exports = getISOTimestamp;
