const buildMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI.trim();
  }

  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const dbName = process.env.MONGODB_DB_NAME || 'file_my_complain';

  if (!user || !password || !cluster) {
    throw new Error(
      'Set MONGODB_URI or all of MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER in backend/.env'
    );
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `mongodb+srv://${encodedUser}:${encodedPassword}@${cluster}/${dbName}?retryWrites=true&w=majority`;
};

module.exports = buildMongoUri;
