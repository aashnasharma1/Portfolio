import React from 'react'
import profilePicture from './../assets/kevinRushProfile.png'
import {MAIN} from './../constants/index.js'
import { motion } from "framer-motion"

const container= (delay) =>({
  hidden: {x: -100, opacity: 0},
  visible: {
    x: 0,
    opacity: 1,
    transition: {duration: 0.5, delay: delay},
  },
})

function Main() {
  
  return (
    <div className='border-b border-neutral-900 pb-4 lg:mb-35'>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-1/2'>
          <div className='flex flex-col items-center lg:items-start text-center'>
            <motion.h1 
            variants={container(0)}
            initial="hidden"
            animate="visible"
            className='pb-16 text-6xl font-thin tracking-tight lg:mt-16 lg:text-8xl'>
              Aashna Sharma
            </motion.h1>
            <motion.span
             variants={container(0.4)}
             initial="hidden"
             animate="visible"
              className='bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent'>
              React Developer
            </motion.span>
            <motion.p 
             variants={container(0.8)}
             initial="hidden"
             animate="visible"className='my-2 max-w-xl py-6 font-light tracking-tighter'>
             {MAIN}
            </motion.p>
          </div>
        </div>
        <div className='w-full lg:w-1/2 lg:p-8'>
          <div className='flex justify-center'>
            <motion.img 
             initial={{x: 100, opacity: 0}}
             transition={{duration: 0.6, delay: 1.1}}
             animate={{x:0, opacity: 1}}
             src={profilePicture} alt="Aashna Sharma"/>

          </div> 

        </div>
      </div>
        
    </div>
  )
}

export default Main