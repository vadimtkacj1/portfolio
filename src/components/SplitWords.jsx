export default function SplitWords({ text }) {
  return (
    <span className="split" aria-label={text}>
      {text.split(" ").map((word, index) => (
        <span className="split-word" key={index} aria-hidden="true">
          <span style={{ "--i": index }}>{word}</span>{" "}
        </span>
      ))}
    </span>
  );
}
