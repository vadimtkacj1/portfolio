import { Fragment } from "react";

export default function SplitWords({ text }) {
  const words = text.split(" ");
  return (
    <span className="split">
      <span className="visually-hidden">{text}</span>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="split-word" aria-hidden="true">
            <span style={{ "--i": index }}>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
