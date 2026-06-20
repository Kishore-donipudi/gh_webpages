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
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for drag gesture on the active card
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 200], [-25, 25]);
  const opacity = useTransform(dragX, [-200, -150, 0, 150, 200], [0.6, 1, 1, 1, 0.6]);

  const handleNext = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      onIndexChange((activeUserIndex + 1) % matchingUsers.length);
      dragX.set(0);
      dragY.set(0);
      setSwipeDirection(null);
    }, 200);
  };

  const handlePrev = () => {
    setSwipeDirection('right');
    setTimeout(() => {
      onIndexChange((activeUserIndex - 1 + matchingUsers.length) % matchingUsers.length);
      dragX.set(0);
      dragY.set(0);
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
      dragX.set(0);
      dragY.set(0);
    }
  };

  // Preload next image profiles
  useEffect(() => {
    const nextIdx = (activeUserIndex + 1) % matchingUsers.length;
    const nextUser = matchingUsers[nextIdx];
    if (nextUser) {
      const img = new Image();
      img.src = nextUser.avatar_url;
    }
  }, [activeUserIndex, matchingUsers]);

  // Render a card shell for background stacking cards so they look like real profiles
  const renderBackgroundCard = (user, stackPosition) => {
    // Stack position 1 = middle card, 2 = back card
    const scale = stackPosition === 1 ? 0.96 : 0.92;
    
    // Spread more when hovered to create a beautiful hover reveal effect
    let yOffset = stackPosition === 1 ? 16 : 32;
    if (isHovered) {
      yOffset = stackPosition === 1 ? 32 : 64;
    }
    
    const rotateAngle = stackPosition === 1 ? -1.5 : 1.5;
    const zIndex = 30 - stackPosition * 10;
    const cardOpacity = stackPosition === 1 ? 0.8 : 0.5;

    return (
      <motion.div
        key={`bg-card-${user.login}`}
        initial={{ opacity: 0, scale: scale - 0.05, y: yOffset + 10 }}
        animate={{ 
          opacity: cardOpacity, 
          scale: scale, 
          y: yOffset,
          rotate: rotateAngle
        }}
        exit={{ opacity: 0, scale: scale - 0.05, y: yOffset + 10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 w-full glass-card rounded-3xl overflow-hidden select-none pointer-events-none shadow-2xl"
        style={{ zIndex, transformOrigin: 'bottom center' }}
      >
        {/* Gradient Banner matching UserCard style */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-primary-600/60 via-purple-600/60 to-primary-500/60 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
        </div>

        {/* Avatar Area */}
        <div className="flex justify-center -mt-14 sm:-mt-16 relative">
          <img
            src={user.avatar_url}
            alt=""
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-surface-900 shadow-xl object-cover opacity-80"
          />
        </div>

        {/* Basic Info */}
        <div className="px-6 pt-4 pb-6 sm:px-8 text-center mt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white/70">{user.login}</h2>
          <p className="text-primary-400/50 text-sm font-medium mt-0.5">@{user.login}</p>
          <div className="mt-8 flex justify-center">
            <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/10 text-xs font-medium text-primary-300/40">
              Swipe to reveal profile
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const activeUser = matchingUsers[activeUserIndex];
  const nextUser = matchingUsers[(activeUserIndex + 1) % matchingUsers.length];
  const farUser = matchingUsers[(activeUserIndex + 2) % matchingUsers.length];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none">
      {/* Swipe Deck Container */}
      <div 
        className="relative w-full aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center min-h-[460px] sm:min-h-[500px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="popLayout">
          {/* Background Card 2 (Furthest behind) */}
          {matchingUsers.length > 2 && farUser && renderBackgroundCard(farUser, 2)}

          {/* Background Card 1 (Middle) */}
          {matchingUsers.length > 1 && nextUser && renderBackgroundCard(nextUser, 1)}

          {/* Active Card (Front) */}
          <motion.div
            key={`active-${activeUser.login}`}
            style={{ x: dragX, y: dragY, rotate, opacity, zIndex: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={
              swipeDirection === 'left'
                ? { x: -380, opacity: 0, scale: 0.9, rotate: -25 }
                : swipeDirection === 'right'
                ? { x: 380, opacity: 0, scale: 0.9, rotate: 25 }
                : { 
                    x: 0, 
                    y: isHovered ? -8 : 0, 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0 
                  }
            }
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="absolute inset-0 w-full cursor-grab active:cursor-grabbing shadow-2xl"
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
      <div className="text-xs text-surface-200/30 mt-10 text-center select-none flex flex-col gap-1">
        <span className="font-semibold text-primary-400/50">Interactive 3D Stack Deck</span>
        <span>Hover to reveal layered cards below · Swipe or use arrows to browse</span>
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
