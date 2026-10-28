export const ARTICLES = [
  {
    slug: "bm25-vs-dense-vs-hybrid-retrieval",
    title: "BM25, dense or hybrid: which retriever should a RAG system use?",
    date: "2026-10-28",
    topic: "Retrieval",
    project: "rag-eval-service",
    summary:
      "I measured six retrieval pipelines on BEIR SciFact. Dense retrieval wins nDCG@10, the hybrid wins Recall@5, and the choice depends on which of the two your system actually needs.",
    sections: [
      {
        paragraphs: [
          "Most retrieval-augmented generation systems pick a retriever by habit: a vector database because that is what tutorials use, or BM25 because it is already in the search engine. The retriever decides which documents the language model ever sees, so this is the one choice in a RAG system that deserves a measurement.",
          "I ran six pipelines on BEIR SciFact, a public benchmark of 5,183 scientific abstracts and 300 test claims with human relevance labels, and recorded the same metrics for each.",
        ],
      },
      {
        heading: "The results",
        table: {
          columns: ["Retrieval", "nDCG@10", "Recall@5", "Recall@100"],
          rows: [
            ["BM25", "0.652", "0.728", "0.873"],
            ["Dense · bge-small", "0.713", "0.759", "0.942"],
            ["Hybrid · RRF", "0.709", "0.765", "0.965"],
          ],
        },
        paragraphs: [
          "Dense retrieval with the small bge model has the best ranking quality, nDCG@10 of 0.713, about six points above BM25. The hybrid, which merges the BM25 and dense rankings with reciprocal rank fusion, is a hair behind on nDCG@10 but has the best Recall@5 and Recall@100.",
        ],
      },
      {
        heading: "Which number matters for RAG",
        paragraphs: [
          "nDCG@10 rewards putting the single best document at the very top. That matters for a search page where a person reads the first result. A RAG system does not read the first result: it puts the top few documents into the prompt and lets the model use all of them.",
          "For that, Recall@5 is the closer measure: how often the relevant document is anywhere in the five passages the model receives. On that number the hybrid wins, 0.765 against 0.759 for dense and 0.728 for BM25. That is why the hybrid sits behind the API in my service.",
        ],
      },
      {
        heading: "Why the hybrid helps",
        paragraphs: [
          "BM25 matches exact words, which is strong for names, numbers and rare terms. Dense embeddings match meaning, which is strong for paraphrases. Scientific claims contain both kinds of signal, so the two rankings make different mistakes, and fusing them recovers documents either one alone would miss. Recall@100 shows it most clearly: 0.965 for the hybrid against 0.942 for dense.",
        ],
      },
      {
        heading: "What to take from it",
        paragraphs: [
          "Measure on your own data before choosing. A few hundred questions with known correct documents are enough to compute the same table. Decide which metric matches how your system uses the results, and only then pick the retriever. The code, the benchmark harness and the full results table are public.",
        ],
      },
    ],
  },
  {
    slug: "when-a-reranker-makes-retrieval-worse",
    title: "When a cross-encoder reranker makes retrieval worse",
    date: "2026-10-28",
    topic: "Retrieval",
    project: "rag-eval-service",
    summary:
      "Adding a web-trained cross-encoder improved BM25 by three points of nDCG@10 but lowered dense and hybrid retrieval on scientific claims. Rerankers are not free quality.",
    sections: [
      {
        paragraphs: [
          "A common recipe for better RAG is to retrieve a wide set of candidates and re-score them with a cross-encoder, a model that reads the query and each passage together. It is slower than embedding search but usually more accurate. I tested that recipe on BEIR SciFact with the widely used ms-marco MiniLM cross-encoder.",
        ],
      },
      {
        heading: "The numbers",
        table: {
          columns: ["Pipeline", "Without reranker", "With reranker"],
          rows: [
            ["BM25", "0.652", "0.682"],
            ["Dense · bge-small", "0.713", "0.696"],
            ["Hybrid · RRF", "0.709", "0.697"],
          ],
        },
        paragraphs: [
          "All values are nDCG@10. The reranker lifts BM25 by three points, as the recipe promises. On top of dense and hybrid retrieval it does the opposite: nDCG@10 drops by 1.7 and 1.2 points, and Recall@5 drops as well.",
        ],
      },
      {
        heading: "Why it happens",
        paragraphs: [
          "The cross-encoder was trained on MS MARCO, a dataset of web search queries and web passages. SciFact is scientific claims against paper abstracts. When the first-stage ranking is weak, as BM25 is here, the reranker's general sense of relevance still helps. When the first stage is already strong, its out-of-domain judgement replaces a good ranking with a worse one.",
        ],
      },
      {
        heading: "What I did with it",
        paragraphs: [
          "The reranker stays in the service as an option, switched off by default, because on this data it costs latency and quality. On another dataset, or with a reranker trained on scientific text, the result could flip, which is exactly why the benchmark runs on every change instead of once.",
        ],
      },
    ],
  },
  {
    slug: "why-pixel-iou-flatters-segmentation",
    title: "Why a 0.944 IoU can flatter a segmentation model",
    date: "2026-10-28",
    topic: "Computer vision",
    project: "vessel-segmentation",
    summary:
      "My retinal vessel model scores a pixel IoU of 0.944, averaged over background and vessel. Background is most of every image, so the metric to report next is vessel-only.",
    sections: [
      {
        paragraphs: [
          "My retinal vessel segmentation model, DeepLabV3+ with a ResNet-101 encoder trained on 512 × 512 fundus photographs, reaches a pixel IoU of 0.944 on the test split. That number is real, and it is also easy to over-read.",
        ],
      },
      {
        heading: "What the average hides",
        paragraphs: [
          "The 0.944 is the mean of two IoU values: one for the background class and one for the vessel class. In a fundus photograph the vessels cover a small share of the pixels and the background covers the rest. A model that gets the large background region almost perfectly right earns a background IoU close to 1, and that lifts the average no matter how well it traces the vessels.",
          "The thinnest capillaries are a few pixels wide. Missing them barely moves an averaged score, yet they are exactly the structures a screening tool for diabetic retinopathy cares about.",
        ],
      },
      {
        heading: "What to report instead",
        paragraphs: [
          "For thin structures on a large background, report the vessel class on its own: vessel-only Dice and IoU, plus sensitivity, the share of true vessel pixels the model finds. Sensitivity in particular shows whether the capillaries survive. Looking at the error map next to the ground truth is often more informative than any single number.",
          "That is the next step for this model, and the case study says so. A portfolio number is more useful when it comes with a note on what it does not measure.",
        ],
      },
    ],
  },
];
