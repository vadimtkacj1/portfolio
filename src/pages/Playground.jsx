import BoundaryGame from "../components/BoundaryGame.jsx";
import DescentGame from "../components/DescentGame.jsx";
import DigitGame from "../components/DigitGame.jsx";
import PatternGame from "../components/PatternGame.jsx";
import SpotGame from "../components/SpotGame.jsx";
import SplitWords from "../components/SplitWords.jsx";

export default function Playground() {
  return (
    <>
      <section className="page-hero" aria-labelledby="playground-title">
        <div className="container">
          <p className="section-label">Playground</p>
          <h1 id="playground-title" className="page-title reveal-split">
            <SplitWords text="Play with my models" />
          </h1>
          <p className="page-lead">
            Five small games about how models learn and what they see. Nothing is sent to a server: everything runs in
            your browser, on models I trained and outputs from my own projects.
          </p>
        </div>
      </section>

      <section className="game section" aria-labelledby="digit-title">
        <div className="container">
          <div className="game-head">
            <span className="service-index">01</span>
            <h2 id="digit-title" className="game-title">
              Draw a digit
            </h2>
            <p>Write any digit with your mouse or finger. The network reads it as you draw.</p>
          </div>
          <DigitGame />
        </div>
      </section>

      <section className="game section" aria-labelledby="spot-title">
        <div className="container">
          <div className="game-head">
            <span className="service-index">02</span>
            <h2 id="spot-title" className="game-title">
              Spot the model
            </h2>
            <p>
              Each round shows a retinal photo and two vessel masks. One is drawn by a human expert, the other by my
              DeepLabV3+ model. Pick the model.
            </p>
          </div>
          <SpotGame />
        </div>
      </section>

      <section className="game section" aria-labelledby="descent-title">
        <div className="container">
          <div className="game-head">
            <span className="service-index">03</span>
            <h2 id="descent-title" className="game-title">
              Descent
            </h2>
            <p>
              Training is a ball rolling downhill on a loss landscape. Pick a start, a learning rate and momentum, and
              try to reach the deepest basin in as few steps as you can.
            </p>
          </div>
          <DescentGame />
        </div>
      </section>

      <section className="game section" aria-labelledby="boundary-title">
        <div className="container">
          <div className="game-head">
            <span className="service-index">04</span>
            <h2 id="boundary-title" className="game-title">
              Draw the boundary
            </h2>
            <p>
              A small neural network learns to separate blue points from black ones while you watch. Click to add
              points, change its width, and find the smallest network that still solves the spiral.
            </p>
          </div>
          <BoundaryGame />
        </div>
      </section>

      <section className="game section" aria-labelledby="pattern-title">
        <div className="container">
          <div className="game-head">
            <span className="service-index">05</span>
            <h2 id="pattern-title" className="game-title">
              Beat the model
            </h2>
            <p>
              Rock, paper, scissors against a model that learns your habits while you play. Try to stay random: almost
              nobody can for long.
            </p>
          </div>
          <PatternGame />
        </div>
      </section>
    </>
  );
}
