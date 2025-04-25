import React, { useEffect } from 'react'

const Faq:React.FC = () => {
  
  useEffect(()=>{
    document.title = "Buy Me a Tea | FAQ"
  })
  return (
    <div>faq-page</div>
  )
}

export default Faq