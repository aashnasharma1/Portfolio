import React from 'react'
import aboutMe from './../assets/about.jpg'
import { ABOUTME } from '../constants'
import {motion} from "framer-motion"


function AboutMe() {
  return (
    <div className='border-b border-neutral-900 pb-4 text-center'>
        <h2 className='my-20 text-ceter text-4xl'>About
        <span className='text-neutral-500'> Me</span>
        </h2>
        <div className='flex flex-wrap'>
            <motion.div
            whileInView={{opacity: 1, x: 0}}
            initial={{opacity: 0, x: -100}}
            transition={{duration: 0.5}}
            className='w-full lg:w-1/2 p-8'>
                <div className='flex items-center justify-center'>
                    <img src={aboutMe} alt="Aashna sharma" className='rounded-2xl'/>
                </div>
            </motion.div>
            <motion.div c
            whileInView={{opacity: 1, x: 0}}
            initial={{opacity: 0, x: 100}}
            transition={{duration: 0.5}}
            lassName='w-full lg:w-1/2'>
                    <div className='flex justify-center lg:justify-start'>
                        <p className='my-2 max-w-xl y-6 p-8'>{ABOUTME}
                        </p>                       
                    </div>
                </motion.div>
        </div>

    </div>
  )
}

export default AboutMe