import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import UserCard from './UserCard';
import { SkeletonUserCard } from './SkeletonCards';

export default function UserSwipeDeck({
  matchingUsers,
  activeUserIndex,
  onIndexChange,
  userData,
  isLoadingDetails,
}) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Motion values for swipe animation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const handleNext = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      onIndexChange((activeUserIndex + 1) % matchingUsers.length);
      x.set(0);
      setSwipeDirection(null);
    }, 200);
  };

  const handlePrev = () => {
    setSwipeDirection('right');
    setTimeout(() => {
      onIndexChange((activeUserIndex - 1 + matchingUsers.length) % matchingUsers.length);
      x.set(0);
      setSwipeDirection(null);
    }, 200);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 120;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    } else {
      x.set(0);
    }
  };

  // Pre-load the next user's avatar image to keep animations smooth
  const nextUser = matchingUsers[(activeUserIndex + 1) % matchingUsers.length];
  const prevUser = matchingUsers[(activeUserIndex - 1 + matchingUsers.length) % matchingUsers.length];

  useEffect(() => {
    if (nextUser) {
      const img = new Image();
      img.src = nextUser.avatar_url;
    }
    if (prevUser) {
      const img = new Image();
      img.src = prevUser.avatar_url;
    }
  }, [nextUser, prevUser]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none">
      {/* Swipe Deck Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {/* Background Card 2 (Deepest) */}
          {matchingUsers.length > 2 && (
            <motion.div
              key={`bg2-${matchingUsers[(activeUserIndex + 2) % matchingUsers.length].login}`}
              initial={{ scale: 0.85, y: 35, opacity: 0 }}
              animate={{ scale: 0.9, y: 24, opacity: 0.35 }}
              exit={{ scale: 0.85, y: 35, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 glass-card rounded-3xl p-6 h-[90%] flex flex-col justify-end items-center opacity-30 select-none pointer-events-none"
              style={{ transformOrigin: 'bottom center' }}
            >
              <div className="w-16 h-16 rounded-full bg-surface-800 border border-primary-500/10 mb-4 overflow-hidden">
                <img
                  src={matchingUsers[(activeUserIndex + 2) % matchingUsers.length].avatar_url}
                  alt=""
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              <div className="text-white/20 font-medium text-sm">
                @{matchingUsers[(activeUserIndex + 2) % matchingUsers.length].login}
              </div>
            </motion.div>
          )}

          {/* Background Card 1 (Middle) */}
          {matchingUsers.length > 1 && (
            <motion.div
              key={`bg1-${nextUser.login}`}
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 0.95, y: 12, opacity: 0.7 }}
              exit={{ scale: 0.9, y: 24, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 glass-card rounded-3xl p-6 h-[95%] flex flex-col justify-end items-center opacity-70 select-none pointer-events-none"
              style={{ transformOrigin: 'bottom center' }}
            >
              <div className="w-20 h-20 rounded-full bg-surface-800 border border-primary-500/20 mb-4 overflow-hidden">
                <img
                  src={nextUser.avatar_url}
                  alt=""
                  className="w-full h-full object-cover opacity-75"
                />
              </div>
              <div className="text-white/40 font-semibold text-sm">
                @{nextUser.login}
              </div>
            </motion.div>
          )}

          {/* Active Card (Front) */}
          <motion.div
            key={`active-${matchingUsers[activeUserIndex].login}`}
            style={{ x, rotate, opacity, zIndex: 10 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={
              swipeDirection === 'left'
                ? { x: -350, opacity: 0, scale: 0.9, rotate: -20 }
                : swipeDirection === 'right'
                ? { x: 350, opacity: 0, scale: 0.9, rotate: 20 }
                : { x: 0, opacity: 1, scale: 1, rotate: 0 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute inset-0 w-full cursor-grab active:cursor-grabbing"
          >
            {isLoadingDetails || !userData ? (
              <div className="h-full w-full pointer-events-none">
                <SkeletonUserCard />
              </div>
            ) : (
              <UserCard user={userData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Instructions */}
      <div className="text-xs text-surface-200/30 mt-4 text-center select-none">
        Swipe left or right, or use the controls below to browse profiles
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full px-8 mt-6">
        <button
          onClick={handlePrev}
          className="sort-btn p-3.5 rounded-2xl text-primary-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform"
          aria-label="Previous Profile"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Indicator */}
        <div className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300">
          {activeUserIndex + 1} of {matchingUsers.length}
        </div>

        <button
          onClick={handleNext}
          className="sort-btn p-3.5 rounded-2xl text-primary-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform"
          aria-label="Next Profile"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
