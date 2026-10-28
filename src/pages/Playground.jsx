import DigitGame from "../components/DigitGame.jsx";
import SpotGame from "../components/SpotGame.jsx";

export default function Playground() {
  return (
    <>
      <section className="page-hero" aria-labelledby="playground-title">
        <div className="container">
          <p className="section-label">Playground</p>
          <h1 id="playground-title" className="page-title">
            Play with my models
          </h1>
          <p className="page-lead">
            Two small games built on models I trained. Nothing is sent to a server: the network for the first one runs
            in your browser, the second one uses real test outputs from my vessel segmentation model.
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
    </>
  );
}
