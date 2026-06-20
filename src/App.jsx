import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import UserCard from './components/UserCard';
import UserReposList from './components/UserReposList';
import RepoCard from './components/RepoCard';
import SortControls from './components/SortControls';
import SkeletonCards, { SkeletonUserCard } from './components/SkeletonCards';
import ErrorMessage from './components/ErrorMessage';
import { fetchUser, fetchUserRepos, searchReposByTopic } from './api/github';

export default function App() {
  const [activeTab, setActiveTab] = useState('user');

  // User profile state
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  // Topic repos state
  const [topicRepos, setTopicRepos] = useState([]);
  const [topicTotalCount, setTopicTotalCount] = useState(0);
  const [topicSortBy, setTopicSortBy] = useState('stars');
  const [topicLoading, setTopicLoading] = useState(false);
  const [topicError, setTopicError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [topicPage, setTopicPage] = useState(1);
  const [hasMoreTopicPages, setHasMoreTopicPages] = useState(false);

  // Handle user search
  const handleUserSearch = useCallback(async (username) => {
    setUserLoading(true);
    setUserError('');
    setUserData(null);
    setUserRepos([]);

    try {
      const [user, repos] = await Promise.all([
        fetchUser(username),
        fetchUserRepos(username),
      ]);
      setUserData(user);
      setUserRepos(repos);
    } catch (err) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Handle topic search
  const handleTopicSearch = useCallback(
    async (topic) => {
      setTopicLoading(true);
      setTopicError('');
      setTopicRepos([]);
      setCurrentTopic(topic);
      setTopicPage(1);

      try {
        const data = await searchReposByTopic(topic, topicSortBy, 1, 30);
        setTopicRepos(data.items || []);
        setTopicTotalCount(data.total_count || 0);
        setHasMoreTopicPages((data.items || []).length === 30);
      } catch (err) {
        setTopicError(err.message);
      } finally {
        setTopicLoading(false);
      }
    },
    [topicSortBy]
  );

  // Handle sort change (re-fetch with new sort)
  const handleSortChange = useCallback(
    async (newSort) => {
      if (newSort === topicSortBy) return;
      setTopicSortBy(newSort);

      if (!currentTopic) return;
      setTopicLoading(true);
      setTopicError('');
      setTopicRepos([]);
      setTopicPage(1);

      try {
        const data = await searchReposByTopic(currentTopic, newSort, 1, 30);
        setTopicRepos(data.items || []);
        setTopicTotalCount(data.total_count || 0);
        setHasMoreTopicPages((data.items || []).length === 30);
      } catch (err) {
        setTopicError(err.message);
      } finally {
        setTopicLoading(false);
      }
    },
    [topicSortBy, currentTopic]
  );

  // Load more topic repos
  const handleLoadMore = useCallback(async () => {
    if (!currentTopic || topicLoading) return;
    const nextPage = topicPage + 1;
    setTopicLoading(true);

    try {
      const data = await searchReposByTopic(currentTopic, topicSortBy, nextPage, 30);
      setTopicRepos((prev) => [...prev, ...(data.items || [])]);
      setTopicPage(nextPage);
      setHasMoreTopicPages((data.items || []).length === 30);
    } catch (err) {
      setTopicError(err.message);
    } finally {
      setTopicLoading(false);
    }
  }, [currentTopic, topicSortBy, topicPage, topicLoading]);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'user' && (
            <motion.div
              key="user-tab"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SearchBar
                onSearch={handleUserSearch}
                placeholder="Enter a GitHub username…"
                isLoading={userLoading}
              />

              <div className="mt-8">
                <ErrorMessage message={userError} onDismiss={() => setUserError('')} />

                {userLoading && <SkeletonUserCard />}

                <AnimatePresence mode="wait">
                  {userData && !userLoading && (
                    <motion.div
                      key={userData.login}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserCard user={userData} />
                      <UserReposList repos={userRepos} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state */}
                {!userData && !userLoading && !userError && (
                  <EmptyState
                    icon={
                      <svg className="w-16 h-16 text-primary-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                    title="Search for a GitHub user"
                    subtitle="Enter a username to view their profile, repositories, and stats"
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'topic' && (
            <motion.div
              key="topic-tab"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SearchBar
                onSearch={handleTopicSearch}
                placeholder="Search repos by topic (e.g. react, machine-learning)…"
                isLoading={topicLoading}
              />

              <div className="mt-8">
                <ErrorMessage message={topicError} onDismiss={() => setTopicError('')} />

                {topicRepos.length > 0 && (
                  <SortControls
                    sortBy={topicSortBy}
                    onSortChange={handleSortChange}
                    totalCount={topicTotalCount}
                  />
                )}

                {topicLoading && topicRepos.length === 0 && <SkeletonCards count={6} />}

                <AnimatePresence>
                  {topicRepos.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {topicRepos.map((repo, i) => (
                        <RepoCard key={repo.id} repo={repo} index={i} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Load More */}
                {hasMoreTopicPages && topicRepos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-8"
                  >
                    <button
                      onClick={handleLoadMore}
                      disabled={topicLoading}
                      className="btn-glow px-8 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 cursor-pointer flex items-center gap-2"
                    >
                      {topicLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading…
                        </>
                      ) : (
                        <>
                          Load More
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Empty state */}
                {!topicRepos.length && !topicLoading && !topicError && (
                  <EmptyState
                    icon={
                      <svg className="w-16 h-16 text-primary-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    }
                    title="Explore repos by topic"
                    subtitle="Search for topics like react, python, machine-learning, or any GitHub topic"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-surface-200/20 border-t border-primary-500/5">
        <p>
          Built with React · Powered by{' '}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400/40 hover:text-primary-300 transition-colors"
          >
            GitHub API
          </a>
        </p>
      </footer>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center justify-center py-16 sm:py-24"
    >
      {icon}
      <h3 className="text-lg font-semibold text-white/30 mt-4">{title}</h3>
      <p className="text-sm text-surface-200/20 mt-1 max-w-xs text-center">{subtitle}</p>
    </motion.div>
  );
}
