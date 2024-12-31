"use client"

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface SlideToUnlockProps {
  onUnlock: () => void
  width?: number
  height?: number
  unlockedText?: string
}

const SlideToUnlock: React.FC<SlideToUnlockProps> = ({ onUnlock, width = 400, height = 60, unlockedText = 'Slide To Unlock' }) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const controls = useAnimation()
  const x = useMotionValue(0)
  const xInput = [0, width - height]
  const background = useTransform(x, xInput, [
    "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%)",
    "linear-gradient(90deg, #3a86ff 0%, #8338ec 100%)"
  ])

  const handleDragEnd = () => {
    const draggedWidth = x.get()
    if (draggedWidth > width - height - 20) {
      setIsUnlocked(true)
      controls.start({ x: width - height })
      onUnlock()

      setTimeout(() => {
        setIsUnlocked(false)
        controls.start({ x: 0 })
      }, 1000);


    } else {
      controls.start({ x: 0 })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      setIsUnlocked(true)
      controls.start({ x: width - height })
      onUnlock()
    }
  }

  useEffect(() => {
    if (isUnlocked)
      controls.start({ x: 0 });
  }, [isUnlocked, controls]);

  return (
    <motion.div
      style={{ background, width, height }}
      className="relative rounded-full overflow-hidden shadow-lg border border-gray-700"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm tracking-wider"
        initial={{ opacity: 1 }}
        animate={{ opacity: isUnlocked ? 0 : 1 }}
      >
        {isUnlocked ? '' : unlockedText}
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: width - height }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="absolute left-0 top-0 bottom-0 w-[60px] bg-white bg-opacity-10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center cursor-pointer"
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((x.get() / (width - height)) * 100)}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="text-gray-800" size={24} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SlideToUnlock

