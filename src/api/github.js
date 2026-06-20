const BASE_URL = 'https://api.github.com';

/**
 * Fetch a GitHub user profile by username.
 */
export async function fetchUser(username) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Search users by query.
 */
export async function searchUsers(query, page = 1, perPage = 15) {
  const res = await fetch(
    `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) {
    if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    throw new Error(`User search failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch repositories for a GitHub user.
 */
export async function fetchUserRepos(username, page = 1, perPage = 100) {
  const res = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) throw new Error(`Failed to fetch repos: ${res.status}`);
  return res.json();
}

/**
 * Search repositories by topic, sorted by stars or forks.
 */
export async function searchReposByTopic(topic, sortBy = 'stars', page = 1, perPage = 30) {
  const res = await fetch(
    `${BASE_URL}/search/repositories?q=topic:${encodeURIComponent(topic)}&sort=${sortBy}&order=desc&per_page=${perPage}&page=${page}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (!res.ok) {
    if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    if (res.status === 422) throw new Error('Invalid search query. Please try a different topic.');
    throw new Error(`Search failed: ${res.status}`);
  }
  return res.json();
}
