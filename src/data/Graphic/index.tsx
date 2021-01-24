import React from 'react';
import Lottie from 'react-lottie';
const data1  = require('../33172-01-finishig-studies.json');
const data2  = require('../33190-girl-on-floor.json');
const data3  = require('../33287-coworkers-make-break.json');
const data4  = require('../33733-treadmill-workout-running.json');
const styles = require('./styles.scss');

interface GraphicProps {
  panel: number;
  progress: number;
  counter: number;
}

const Graphic: React.FC<GraphicProps> = ({ panel, progress, counter }) => {
  console.log(panel)
  console.log(progress)
  console.log(counter)
  const config1 = {
    loop: true,
    autoplay: true,
    animationData: data1,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const config2 = {
    loop: true,
    autoplay: true,
    animationData: data2,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const config3 = {
    loop: true,
    autoplay: true,
    animationData: data3,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const config4 = {
    loop: true,
    autoplay: true,
    animationData: data4,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  return (
    <div className={styles.root}>
      { panel === 1 ?  <Lottie options={config1} height={900} width={900}/> : '' }
      { panel === 2 ? <Lottie options={config2} height={900} width={900}/> : '' }
      { panel === 3 ? <Lottie options={config3} height={900} width={900}/> : '' }
      { panel === 4 ? <Lottie options={config4} height={900} width={900}/> : '' }
    </div>
  );
};

export default Graphic;