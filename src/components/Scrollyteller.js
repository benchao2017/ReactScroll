/** @jsx jsx */
import { useEffect, useState, useCallback } from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";
import { Scrollama, Step } from "react-scrollama";
import { narrativeStyle } from "../helper/constants"

// import Lottie from 'react-lottie';
import Tabletop from "tabletop";
import scrollama from "scrollama";
// import Lottie from 'lottie-react-web';
// import "@lottiefiles/lottie-player";
import "@lottiefiles/lottie-player";
import { create } from "@lottiefiles/lottie-interactivity";
// import { Lottie } from './components/Lottie';

import VideoBackground from "./VideoBackground";

// import ScrollAnimation from "./ScrollAnimation";
import MyGallery from "./Gallery";
import FlockAnimation from "./FlockAnimation";
import WaterAnimation from "./WaterAnimation";

import Chart from "./Chart";
import D3Header from "./D3Header";

import background from "../background.png"
import load from "../assets/images/load.gif"

// import button from "../button.svg";
// import { TangentSpaceNormalMap } from "three";

//** values ​​handled in percentages, example 25 = 25% ***********/
const fadeIn = 10; // the lottie appears completely when this percentage is reached
const fadeOut = 85; // the lottie starts to disappear when this percentage is reached

/****************** */

// console.log(myScrollyTellerInstance);

const narration = require("../assets/data/narration.json");

// const introBlurb = (
//   <div>
//     <br></br>
//     <p>
//       You can intro your story here, or delete this by deleting the "introBlurb"
//       constant from being defined and from being rendered. This text export from
//       goole sheet
//     </p>
//     <br></br>
//   </div>
// );

function Scrollyteller() {
  const [data, setData] = useState("1");
  const [progress, setProgress] = useState(0);
  // const [src, setSrc] = useState("");
  const [items, setItems] = useState([]);
  const [isOpen, setIsGalleryOpen] = useState(false);
  const [isOverlay, setOverlay] = useState(true);

  function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
    window.scrollTo({ top: 0 });
  }

  function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
    window.scrollTo({ top: 0 });
  }

  const setLoading = (val) => {
    setOverlay(val);
    if (!val) {
      reloadScrollBars();
    } else {
      unloadScrollBars();
    }
  }

  let cardScroll = items ? [...items].splice(3, items.length - 1) : null;
  cardScroll = cardScroll ? cardScroll.splice(0, cardScroll.length - 1) : null;

  let lotties = items ? [...items].filter((e) => e[0].frames != "") : null;
  // console.log(lotties);
  useEffect(() => {
    setLoading(true);
    Tabletop.init({
      key:
        "https://docs.google.com/spreadsheets/d/1RfjhL5U0DvF1P6FtedRA4JuODHe0d1s8XbGgNKHmfdM/edit#gid=0",
      simpleSheet: false,
    })
      .then((items) => {
        let auxItems = [];
        let value = "1";

        for (let i = 0; i < items["Sheet2"].elements.length; i++) {
          let auxArray = items["Sheet2"].elements.filter(
            (e) => e.slide === value
          );

          i += auxArray.length;
          i--;

          value = items["Sheet2"].elements[i + 1]?.slide;

          auxItems.push(auxArray);
        }

        setItems(auxItems);
        console.log(JSON.stringify(auxItems));
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        console.warn(err)
      });
  }, []);

  useEffect(() => {
    // instantiate the scrollama
    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: ".step",
      })
      .onStepEnter((response) => {
        // { element, index, direction }
        if (response.index === 1) {
          response.element.style.background = "none";
        } else if (response.index === 2) {
          response.element.style.background = "none";
        } else {
          response.element.style.background = "none";
        }
      })
      .onStepExit((response) => {
        if (response.index === 1) {
          response.element.style.background = "none";
        } else if (response.index === 2) {
          response.element.style.background = "none";
        } else {
          response.element.style.background = "none";
        }
      });

    // setup resize event
    window.addEventListener("resize", scroller.resize);

    return () => window.removeEventListener("resize", scroller.resize);
  }, []);

  useEffect(() => {
    const actSlide = document.querySelector(`.left-side:nth-child(${data})`);

    if (actSlide) {
      const auxFadeIn = fadeIn / 100;
      const auxFadeOut = fadeOut / 100;

      if (!actSlide.classList.contains("video")) {
        if (items.length > 1) {
          if (progress <= auxFadeIn) {
            actSlide.style.opacity = `${progress * (1 / auxFadeIn)}`;
          } else if (progress > auxFadeIn && progress < auxFadeOut) {
            actSlide.style.opacity = "1";
          } else {
            actSlide.style.opacity = `${(1 - progress) * (1 / (1 - auxFadeOut))
              }`;
          }
        }
      } else {

        if (progress <= 5 / 100) {
          actSlide.style.opacity = "0";
        } else if (progress > 5 / 100 && progress < auxFadeOut) {
          actSlide.style.opacity = "1";
        } else {
          actSlide.style.opacity = "0";
        }
      }
    }
  }, [progress, data, items.length, isOpen]);

  useEffect(() => {

    document.querySelectorAll("lottie-player").forEach((lottie, i) => {
      lottie.addEventListener("load", function (e) {
        create({
          mode: "scroll",
          autoplay: true,
          player: `#lottie${lottie.id.split("lottie")[1]}`,
          container: `#step${lottie.id.split("lottie")[1]}`,
          actions: [
            {
              visibility: [0.1, 0.8],
              type: "seek",
              frames: [0, lotties[i][0].frames],
            },
          ],
        });
      });
    });
  }, [items, progress]);

  const onStepEnter = ({ data }) => {
    // console.log("------------------");
    document.querySelectorAll(".left-side").forEach((lottie, index) => {
      lottie.style.display = index + 1 == data ? "block" : "none";
    });

    // document.querySelector('.content').style.display = data >= 8 ? 'block' : 'none';
    setData(data);
    setProgress(0);
  };

  const onStepExit = ({ element }) => {
    // console.log(element)
    setProgress(0);
    // element.style.backgroundColor = "#fff";
  };

  const onStepProgress = ({ element, progress }) => {
    // console.log(element)
    // console.log(progress)
    setProgress(progress);
    // this.setState({ progress });
  };

  const handleGalleryClick = useCallback((val) => {
    if (val != 7) return;
    setIsGalleryOpen(true);
  }, [isOpen]);

  const handleOnclose = (event) => {
    setIsGalleryOpen(false);
  }

  return (
    <div >
      {isOverlay && <div className="overlay">
        <img src={background} alt="background" style={{ position: 'fixed', 'top': "0", left: '0', "width": "100vw", height: "100vh", zIndex: '9999999' }}></img>
        <div className="progressBar-container"> <img src={load} alt="loading" className="loading"></img>
        </div>
      </div>}
      <img src={background} alt="background" style={{ position: 'fixed', 'top': "0", left: '0', "width": "100vw", height: "100vh", zIndex: '-1' }}></img>
      <div css={narrativeStyle}>
        {items.length > 0 ? (
          <div>
            <D3Header texts={items[0].map((e) => e.description)} />

            <div className="main" style={{ marginBottom: "200px" }}>
              <div className="graphic">
                <lottie-player
                  className="left-side"
                  id={`lottie0`}
                  mode="seek"
                  src={items[1][0].data}
                  key={0}
                ></lottie-player>
              </div>
              <div className="scroller">
                <Scrollama>
                  <Step data={0} key={0}>
                    <div
                      className="step"
                      id={`step0`}
                      style={{
                        marginBottom: "120px",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div className="desc" id={`desc0`} key={`0`}>
                        <Card>
                          <Card.Body>
                            <Card.Text>{items[1][0].description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  </Step>
                </Scrollama>
              </div>
            </div>

            <Chart texts={items[2].map((e) =>               
              {                 
                return <Card>
                  <Card.Body>
                    <Card.Text>{e.description}</Card.Text>
                  </Card.Body>
                </Card>
              
              })} 
              
              />
          </div>
        ) : null}

        <div className="main">
          <div className="graphic">
            {items.length > 0
              ? cardScroll.map((left, i) => {
                if (left[0].slideType === "video") {
                  return (
                    <div className="left-side video" key={i}>
                      <VideoBackground src={left[0].data} />
                    </div>
                  );
                } else if (left[0].slideType === "2d") {
                  return (
                    <div className="left-side" key={i}>
                      <lottie-player
                        id={`lottie${i + 1}`}
                        mode="seek"
                        src={left[0].data}
                        key={i}
                      ></lottie-player>
                    </div>
                  );
                } else if (left[0].slideType === "3d") {
                  if (left[0].data === "dark") {
                    return (
                      <div className="left-side video" key={i}>
                        <WaterAnimation />
                      </div>
                    );
                  }
                } else if (left[0].slideType === "porfolio") {
                  return (
                    <div className="left-side video" key={i}>
                      {isOpen && <MyGallery isOpen={isOpen} lightboxWillClose={handleOnclose} />}
                      {!isOpen && <MyGallery />}
                    </div>
                  );
                }

                return null;
              })
              : null}
          </div>

          <div className="scroller" id="scroller">
            <Scrollama
              onStepEnter={onStepEnter}
              onStepExit={onStepExit}
              progress
              onStepProgress={onStepProgress}
              offset={0.33}
            >
              {cardScroll.length > 0
                ? cardScroll.map((narr, i) => {
                  return (
                    <Step data={i + 1} key={i + 1}>
                      <div onClick={() => handleGalleryClick(i)}
                        className="step"
                        id={`step${i + 1}`}
                        style={{
                          marginBottom: "120px",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        {narr ? (
                          narr.map((card, j) => (
                            <div
                              className="desc"
                              id={`desc${i + 1}-${j + 1}`}
                              key={`${i}-${j}`}
                              style={{ height: "100vh" }}
                            >
                              <Card>
                                <Card.Body>
                                  <Card.Text>{card.description}</Card.Text>
                                </Card.Body>
                              </Card>
                            </div>
                          ))
                        ) : (
                            <div
                              className="desc"
                              id={`desc${i + 1}`}
                              key={`${i}`}
                            >
                              <Card>
                                <Card.Body>
                                  <Card.Text>Loading</Card.Text>
                                </Card.Body>
                              </Card>
                            </div>
                          )}
                      </div>
                    </Step>
                  );
                })
                : narration.map((narr) => (
                  <Step data={narr.key} key={narr.key}>
                    <div
                      className="step"
                      id={`step${narr.key}`}
                      style={{ marginBottom: "100px" }}
                    >
                      <div className="desc" id={"desc" + narr.key}>
                        <Card>
                          <Card.Body>
                            <Card.Text>{narr.description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  </Step>
                ))}
            </Scrollama>
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <WaterAnimation />
        <div
          style={{
            position: "relative",
            top: "0",
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <div
              style={{
                background: "white",
                padding: "20px",
                boxShadow: "2px 2px 10px white",
              }}
            >
              <Card>
                <Card.Body>
                  <Card.Text>
                    {items.length > 0 ? items[12][0].description : "loading..."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div> */}
          
            <a href="https://calendly.com/michaelcastleman/call" target="_blank"><div
             className="bookTimeBtn"
            >
              <span style={{ width: "max-content", color: "white" }}>
                {items.length > 0 ? items[12][0].description : "loading..."}
              </span>
            </div></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scrollyteller;
