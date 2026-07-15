const dns = require('dns');
const mongoose = require('mongoose');
const buildMongoUri = require('./mongodbUri');

// Helper to check if a host resolves via SRV
const testDnsResolve = (host) => {
  return new Promise((resolve) => {
    dns.resolveSrv(host, (err, addresses) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const configureDns = async (uri) => {
  // Extract host from mongodb+srv://...
  const match = uri.match(/mongodb\+srv:\/\/([^/]+)/);
  if (!match) return;

  const hostPart = match[1];
  const host = '_mongodb._tcp.' + (hostPart.includes('@') ? hostPart.split('@')[1] : hostPart);

  // 1. Try with default DNS resolver
  const defaultResolves = await testDnsResolve(host);
  if (defaultResolves) {
    return;
  }

  // 2. Try public DNS servers
  const originalServers = dns.getServers();
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    const publicResolves = await testDnsResolve(host);
    if (publicResolves) {
      return;
    }
  } catch (e) {
    // Ignore error
  }

  // 3. Fallback to original DNS servers
  try {
    dns.setServers(originalServers);
  } catch (e) {
    // Ignore error
  }
};


const connectDB = async () => {
  const uri = buildMongoUri();

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env');
  }

  await configureDns(uri);

  if (uri.includes('<password>') || uri.includes('<username>') || uri.includes('<cluster>')) {
    throw new Error('MONGODB_URI still contains Atlas placeholders. Replace them with real values.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('DNS could not resolve MongoDB Atlas. Check your internet connection or DNS settings.');
    } else if (error.message.includes('bad auth')) {
      console.error('Authentication failed. In Atlas go to Database Access, reset the user password,');
      console.error('then update MONGODB_PASSWORD in backend/.env (use quotes if it has special characters).');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('Your IP may not be whitelisted. In Atlas go to Network Access and allow your current IP.');
    }

    throw error;
  }
};

module.exports = connectDB;
