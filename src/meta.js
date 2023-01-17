exports.addMeta = (beacon, meta) => {
  Object.keys(meta).forEach(key => {
    beacon[`m_${key}`] = meta[key];
  });
}
