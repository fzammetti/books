import React from "react";
import * as gameCore from "../gameCore.js";
import { graphql } from "gatsby";


/**
 * The IndexPage component.
 */
export default class IndexPage extends React.Component {


  /**
   * Constructor.
   */
  constructor(inProps) {

    super(inProps);

    // Expose loaded level data as a global so we can easily get at it in gameCore.
    //noinspection JSUnresolvedVariable
    global.levelData = inProps.data.allLevelsJson.edges;

    console.log("IndexPage.constructor()");

  } /* End constructor. */


  /**
   * Create the game and start it up.
   */
  componentDidMount = () => {

    console.log("IndexPage.componentDidMount()");

    gameCore.init();

  }; /* End componentDidMount(). */


  /**
   * Return the component tree.
   */
  render() {

    console.log("IndexPage.render()");

    const pStyle = { paddingTop : "10px", paddingBottom : "10px" };
    const hrStyle = { marginTop : "10px", marginBottom : "10px" };

    return (
      <div style={{ display : "grid", gridTemplateColumns : "624px 380px", gap : "10px" }}>
        <div id="gameContainer"
          style={{ border : "20px inset #c0c0c0", padding : "4px 0px 0px 4px" }} />
        <div>
          <h1>JAMJumper</h1>
          <h2>A simple, silly little JAMstack game.</h2>
          <hr style={{hrStyle}} />
          <p style={{pStyle}}>Ok, here's the story: you're the lowest-ranking astronaut on a ship whose job it
          is to steal energy orbs from alien civilizations (because isn't that always how it is?!)</p>
          <p style={{pStyle}}>Of course, the aliens aren't exactly happy about this, so you'd better run for
          your life!</p>
          <p style={{pStyle}}>There's just one catch: you have to navigate a series of stone pathways suspended
          over lava (yikes).</p>
          <p style={{pStyle}}>Actually, there's two catches: if you and the orb fall into the lava, not only
          will you be dead, but you'll create a rupture in the spacetime continuum that will destroy the
          universe (to be clear: THAT'S BAD!)</p>
          <p style={{pStyle}}>Finish a planet, and you'll move on to the next and do it all over again - at
          least until you die... or are promoted into a better position (presumably - that possibility is covered in
          the inevitable sequel - #SixSeasonsAndAMovie!)</p>
          <hr style={{hrStyle}} />
          <p style={{pStyle}}>Use the left, right and up arrow keys to jump left, right and straight up.  Get to
          the end and you'll get beamed up to your ship, safe and sound, ready for the next heist... err, retrieval!</p>
          <hr style={{ ...hrStyle, marginBottom : "20px" }} />
          <h3 style={{ color:"#ff0000" }}>Score: <span id="score" /></h3>
          <div onClick={gameCore.startLevel} style={{
            cursor : "pointer", width : "100%", color :"#ffffff", fontWeight : "bold", backgroundColor : "#8080ff",
            textAlign : "center", paddingTop : "10px", paddingBottom : "10px", marginTop : "50px"
          }}>Start Game</div>
        </div>
      </div>
    );

  } /* End render(). */


} /* End class. */



//noinspection JSUnusedGlobalSymbols
export const pageQuery = graphql`
  query LevelsQuery {
    allLevelsJson {
      edges {
        node {
          totalScreens
          data
        }
      }
    }
  }
`;
