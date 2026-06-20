import { motion } from 'framer-motion';

export default function SkeletonCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-card rounded-2xl p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton w-9 h-9 rounded-lg" />
            <div className="flex-1">
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
          <div className="skeleton h-3 w-full mb-2" />
          <div className="skeleton h-3 w-4/5 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="skeleton h-5 w-14 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-12 rounded-full" />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-16 ml-auto" />
          </div>
          <div className="skeleton h-10 w-full rounded-xl mb-4" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonUserCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl overflow-hidden max-w-lg mx-auto w-full"
    >
      <div className="skeleton h-28 sm:h-32 rounded-none" />
      <div className="flex justify-center -mt-14 sm:-mt-16">
        <div className="skeleton w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-surface-900" />
      </div>
      <div className="px-6 pt-4 pb-6 sm:px-8 text-center">
        <div className="skeleton h-6 w-40 mx-auto mb-2" />
        <div className="skeleton h-4 w-24 mx-auto mb-4" />
        <div className="skeleton h-3 w-64 mx-auto mb-2" />
        <div className="skeleton h-3 w-48 mx-auto mb-6" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-10 w-40 mx-auto mt-6 rounded-xl" />
      </div>
    </motion.div>
  );
}
