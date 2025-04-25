import React, { useEffect } from 'react'

const About:React.FC = () => {

  
  useEffect(()=>{
    document.title = "Buy Me a Tea | About"
  })

  return (
    <div>about-page</div>
  )
}

export default About