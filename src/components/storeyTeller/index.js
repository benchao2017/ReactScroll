import React, { useEffect } from 'react';
import scrollama from 'scrollama';

export default function StoreyTeller({}) {
  useEffect(() => {
    // instantiate the scrollama
    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: '.step',
      })
      .onStepEnter((response) => {
        // { element, index, direction }
        if (response.index === 1) {
          response.element.style.background = 'coral';
        } else if (response.index === 2) {
          response.element.style.background = 'green';
        } else {
          response.element.style.background = 'grey';
        }
      })
      .onStepExit((response) => {
        if (response.index === 1) {
          response.element.style.background = 'white';
        } else if (response.index === 2) {
          response.element.style.background = 'white';
        } else {
          response.element.style.background = 'white';
        }
      });

    // setup resize event
    window.addEventListener('resize', scroller.resize);

    return () => window.removeEventListener('resize', scroller.resize);
  }, []);

  return (
    <div>
      <div className="step" data-step="a">
        <div className="demo--step">
          <h1>Demo story teller</h1>
        </div>
      </div>
      <div className="step" data-step="b">
        <div className="demo--step">
          <h1>Demo story teller</h1>
        </div>
      </div>
      <div className="step" data-step="c">
        <div className="demo--step">
          <h1>Demo story teller</h1>
        </div>
      </div>
    </div>
  );
}
