import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import TopCreators from '../../components/common/top-creators';
import NewsLetter from '../../ui/Home/newsletter';
import Howitworks from '../../ui/Home/Howitworks';
import Features from '../../ui/Home/Features';
import TrendingCreators from '../../ui/Home/TrendingCreators';
import HeroSection from '../../ui/Home/HeroSection';

const Home: React.FC = () => {


  useEffect(()=>{
    document.title = "Buy Me a Tea | Home"
  })
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  // Setup animations for each section
  const controls = {
    topCreators: useAnimation(),
    trending: useAnimation(),
    howItWorks: useAnimation(),
    features: useAnimation(),
    newsletter: useAnimation()
  };

  // Setup intersection observers for each section
  const [topCreatorsRef, topCreatorsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [trendingRef, trendingInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [newsletterRef, newsletterInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Trigger animations when sections come into view
  useEffect(() => {
    if (topCreatorsInView) controls.topCreators.start("visible");
    if (trendingInView) controls.trending.start("visible");
    if (howItWorksInView) controls.howItWorks.start("visible");
    if (featuresInView) controls.features.start("visible");
    if (newsletterInView) controls.newsletter.start("visible");
  }, [
    controls, 
    topCreatorsInView, 
    trendingInView, 
    howItWorksInView, 
    featuresInView, 
    newsletterInView
  ]);

  return (
    <motion.div 
      className="max-w-5xl mx-auto px-4 py-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section with initial animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      {/* Top Creators */}
      <motion.div
        ref={topCreatorsRef}
        initial="hidden"
        animate={controls.topCreators}
        variants={sectionVariants}
      >
        <TopCreators />
      </motion.div>

      {/* Trending Creators and Pages */}
      <motion.div
        ref={trendingRef}
        initial="hidden"
        animate={controls.trending}
        variants={sectionVariants}
      >
        <TrendingCreators />
      </motion.div>

      {/* How it works */}
      <motion.div
        ref={howItWorksRef}
        initial="hidden"
        animate={controls.howItWorks}
        variants={sectionVariants}
      >
        <Howitworks />
      </motion.div>

      {/* Features */}
      <motion.div
        ref={featuresRef}
        initial="hidden"
        animate={controls.features}
        variants={sectionVariants}
      >
        <Features />
      </motion.div>

      {/* NewsLetter */}
      <motion.div
        ref={newsletterRef}
        initial="hidden"
        animate={controls.newsletter}
        variants={sectionVariants}
      >
        <NewsLetter />
      </motion.div>
    </motion.div>
  );
};

export default Home;