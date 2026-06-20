import { motion } from 'framer-motion';

export default function UserReposList({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Separate public and private
  const publicRepos = repos.filter((r) => !r.private);
  const privateRepos = repos.filter((r) => r.private);

  // Sort by stars desc
  const sortedPublic = [...publicRepos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="max-w-lg mx-auto w-full mt-6"
    >
      <h3 className="text-base font-semibold text-white/70 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Repositories
        <span className="text-xs text-surface-200/30 font-normal">
          ({publicRepos.length} public{privateRepos.length > 0 ? ` · ${privateRepos.length} private` : ''})
        </span>
      </h3>

      <div className="glass-card rounded-2xl divide-y divide-primary-500/10 max-h-80 overflow-y-auto">
        {sortedPublic.slice(0, 10).map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-primary-500/5 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white/80 truncate group-hover:text-primary-300 transition-colors">
                {repo.name}
              </p>
              {repo.description && (
                <p className="text-xs text-surface-200/30 truncate mt-0.5">{repo.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-200/40 flex-shrink-0">
              {repo.language && (
                <span className="hidden sm:inline">{repo.language}</span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {repo.stargazers_count}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
