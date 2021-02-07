import React from 'react';
import injectSheet from "react-jss";
import { Waypoint } from "react-waypoint";
import nyc from "../chart-data/nyc.js"
import sf from "../chart-data/sf.js"
import am from "../chart-data/am.js"
import BarChart from "./BarChart.js"

const styles = {
  graphic: {
    flexBasis:"50%",
    height:"300px",
    position: "sticky",
    top:"100px",
    fontSize:"60px"
  },
  description: {
    height:"600px",
    textAlign:"center",
    padding:"50px 50px",
    fontSize:"20px"
  },
  container: {
    display:"flex",
    justifyContent:"space-around",
    flexDirection:"column"
  },
  step:{
    height:"max-content",
    width:"90%",
    backgroundColor:"whitesmoke",
    marginBottom:"500px",
    fontSize:"25px",
    textAlign:"center",
    padding:'10px',
    zIndex:1,
    opacity:".8"
  },
  scroller: {
    flexBasis:"40%",
    padding:"500px 0px 0px 0px"
  },
  title: {
    margin:"20px 0",
    padding:"0",
    fontSize:"35px"
  },
  trigger: {
    borderTop:"1px dashed black",
    marginTop: "50vh",
    position:"fixed",
    width:"100%"
  },
  "@media (min-width: 768px)": {
    container: {
      flexDirection:"row"
    },
    step: {
      '&:last-child': {
        marginBottom: "200px",
      }
    },
    description: {
      padding:"100px 250px"
    }
  }
}

const cities = ["nyc", "sf", "am"]
const cityNames = {"nyc": "New York City", "sf": "San Francisco", "am": "Amsterdam", "": ""}

class Chart extends React.Component {
  state = {
    temps:{},
    city: "",
    screenWidth: 0,
    screenHeight: 0
  }

  componentDidMount() {
      sf.forEach(day => (day.date = new Date(day.date)));
      nyc.forEach(day => (day.date = new Date(day.date)));
      am.forEach(day => (day.date = new Date(day.date)));
      this.setState({ temps: { sf, nyc, am } });
      window.addEventListener('resize', this.onResize, false)
      this.onResize()
  }

  onResize = () => {
    let screenWidth = window.innerWidth
    let screenHeight = window.innerHeight

    if( screenWidth > 768 ) {
      screenWidth = screenWidth * .42;
    } else {
      screenWidth = screenWidth * .90;
    }

    this.setState({screenWidth, screenHeight})
  }

  onStepEnter = (city, {currentPosition, previousPosition}) => {
    this.setState({city})


  }

  onStepExit = (city, {currentPosition, previousPosition}) => {
    if( city === "nyc" && currentPosition === "below") {
      this.setState({city: ""})
    }

    const el = document.querySelector(`#waypoint-${city}`)
    el.style.backgroundColor = 'whitesmoke';

  }

  render() {
    const { classes } = this.props
    const {texts} = this.props
    cityNames['nyc'] = texts[0];
    cityNames['sf'] = texts[1];
    cityNames['am'] = texts[2];
    const { city, screenWidth, screenHeight } = this.state


    return (
      <div style={{marginTop:'30px'}}>
        {/* <div className={classes.trigger}>trigger</div>
        <div className={classes.description}>
          Scrollytelling is a technique used to make changes to a graphic or other ui component as a reader scrolls down a page.
          In this example, I use <a href="https://www.npmjs.com/package/react-waypoint">react-waypoint</a>, a React interface of the <a href="http://imakewebthings.com/waypoints/">waypoints library</a>, to alter a line graph
          of weather data built with D3.js as you scroll. Try it out!
        </div> */}
        <div className={classes.container}>
          <div className={classes.graphic}>
            <p className={classes.title}>Mobile phone activity: <span style={{color:"#1aa3ff", padding:"3px", borderRadius:"2px"}}>{cityNames[city]}</span></p>
            <BarChart width={screenWidth} height={screenHeight} data={city ? this.state.temps[city] : {} } />
          </div>
          <div className={classes.scroller}>
            {cities.map(city => {
              return (
                <Waypoint onEnter={((obj) => this.onStepEnter(city, obj))} onLeave={((obj) => this.onStepExit(city, obj))} scrollableAncestor={window} topOffset={"33%"} bottomOffset={"66%"} key={city}>
                  <div id={`waypoint-${city}`} className={classes.step} key={city}>{cityNames[city]} </div>
                </Waypoint>
              )
            })}
          </div>
        </div>
        <div style={{height:"200px"}}></div>
      </div>
    );
  }
}

export default injectSheet(styles)(Chart);
