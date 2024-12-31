"use client"

import React from 'react'
import SlideToUnlock from '../components/SlideToUnlock'
import localFont from 'next/font/local'
import NeuralCanvas from '../components/NeuralCanvas'

const experimentalFont = localFont({
  src: '../fonts/RafginsRegular-51ZMB.ttf',
  display: 'swap',
})


export default function Home() {

  const handleUnlockTask = (taskNumber: number) => {
    window.open(`task${taskNumber}`, '_blank');
  }

  const openDoc = (link: string) => {
    window.open(link, '_ blank');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <NeuralCanvas />

      <h1 className={`${experimentalFont.className} text-4xl font-bold text-white mb-8`} >SAIF UL HAQ - BOND Treasury Tasks</h1>
      <SlideToUnlock onUnlock={() => handleUnlockTask(1)} unlockedText='Mandatory Task' />
      <SlideToUnlock onUnlock={() => openDoc("https://docs.google.com/document/d/1gUMH6NpA1LphdpOXCi9s28RJyl-vua5o-tzeIz_4RrA/edit?usp=sharing")} unlockedText='Other Tasks' />
    </div>
  )
}

