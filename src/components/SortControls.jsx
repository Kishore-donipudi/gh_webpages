import { motion, AnimatePresence } from 'framer-motion';

export default function SortControls({ sortBy, onSortChange, totalCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6"
    >
      {/* Result count */}
      <AnimatePresence mode="wait">
        <motion.p
          key={totalCount}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-sm text-surface-200/40"
        >
          Found <span className="text-white font-semibold">{totalCount.toLocaleString()}</span> repositories
        </motion.p>
      </AnimatePresence>

      {/* Sort buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-200/30 mr-1">Sort by</span>
        <button
          onClick={() => onSortChange('stars')}
          className={`sort-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer ${
            sortBy === 'stars' ? 'active' : 'text-surface-200/50'
          }`}
        >
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Stars
        </button>
        <button
          onClick={() => onSortChange('forks')}
          className={`sort-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer ${
            sortBy === 'forks' ? 'active' : 'text-surface-200/50'
          }`}
        >
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Forks
        </button>
      </div>
    </motion.div>
  );
}
