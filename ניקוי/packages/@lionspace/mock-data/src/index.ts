/**
 * @lionspace/mock-data - Mock data for development and testing
 */

export * from './messages';
export * from './actors';

// Re-export for convenience
export { MULTILINGUAL_MESSAGES as messages } from './messages';
export { FAKE_RESISTANCE_ACTORS as actors, NETWORK_CONNECTIONS as networkConnections } from './actors';