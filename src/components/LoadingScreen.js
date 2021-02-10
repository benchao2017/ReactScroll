import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    position:'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: "rgba(255,255,255,0.5)",
    backdropFilter: 'blur(50px)',
    display: 'flex',
    justifyContent: 'center',
  }
}));

function LoadingScreen() {
  const classes = useStyles();
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Box width={400}>
        <LinearProgress />
      </Box>
    </div>
  );
}

export default LoadingScreen;
