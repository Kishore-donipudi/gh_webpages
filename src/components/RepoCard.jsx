import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RepoCard({ repo, index }) {
  const [copied, setCopied] = useState(false);

  const {
    name,
    full_name,
    description,
    html_url,
    clone_url,
    stargazers_count,
    forks_count,
    language,
    topics,
    owner,
    updated_at,
    visibility,
  } = repo;

  const cloneCmd = `git clone ${clone_url}`;
  const updatedDate = new Date(updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cloneCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = cloneCmd;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Language color mapping
  const langColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Java: '#b07219',
    Go: '#00add8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4f5d95',
    Swift: '#f05138',
    Kotlin: '#a97bff',
    Dart: '#00b4ab',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Lua: '#000080',
    R: '#198ce7',
    Scala: '#c22d40',
    Vue: '#41b883',
    Jupyter: '#da5b0b',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.8),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={owner.avatar_url}
              alt={owner.login}
              className="w-9 h-9 rounded-lg flex-shrink-0 border border-primary-500/20"
            />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{name}</h3>
              <p className="text-xs text-surface-200/40 truncate">{owner.login}</p>
            </div>
          </div>
          <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            visibility === 'public'
              ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
          }`}>
            {visibility}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-surface-200/50 text-sm mt-3 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Topics */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-300/70 border border-primary-500/10"
              >
                {topic}
              </span>
            ))}
            {topics.length > 5 && (
              <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-surface-700/50 text-surface-200/40">
                +{topics.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-4 text-xs text-surface-200/50">
          {/* Stars */}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-semibold text-amber-300">{stargazers_count.toLocaleString()}</span>
          </span>

          {/* Forks */}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="font-semibold">{forks_count.toLocaleString()}</span>
          </span>

          {/* Language */}
          {language && (
            <span className="flex items-center gap-1.5 ml-auto">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: langColors[language] || '#8b949e' }}
              />
              <span className="font-medium">{language}</span>
            </span>
          )}
        </div>

        {/* Updated date */}
        <p className="text-[10px] text-surface-200/30 mt-2">
          Updated {updatedDate}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Visit Repo Link */}
        <a
          href={html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold text-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Repository
        </a>
      </div>

      {/* Clone Snippet */}
      <div className="clone-box mx-5 mb-5 sm:mx-6 sm:mb-6 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
        <code className="text-xs sm:text-sm text-primary-300/70 truncate select-all">
          {cloneCmd}
        </code>
        <button
          onClick={handleCopy}
          className="copy-btn flex-shrink-0 p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors cursor-pointer"
          title="Copy clone command"
        >
          {copied ? (
            <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-surface-200/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}
