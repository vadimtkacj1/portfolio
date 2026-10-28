export const CASES = {
  "rag-eval-service": {
    cover: { type: "table" },
    language: "Python",
    facts: [
      ["Dataset", "BEIR SciFact: 5,183 abstracts, 300 test claims"],
      ["Best nDCG@10", "0.713, dense retrieval with bge‑small"],
      ["Best Recall@5", "0.765, BM25 + dense hybrid"],
      ["Reranker", "Helps BM25 by 3 points, hurts dense and hybrid"],
    ],
    problem:
      "Most RAG systems pick a retriever by habit. The retriever decides which documents the model ever sees, so the choice should come from a measurement on a labelled dataset, not from a default.",
    approach: [
      "Six pipelines behind one search(query, k) interface: BM25, dense embeddings, reciprocal rank fusion of both, and each of them re-scored by a cross-encoder.",
      "A benchmark harness that reports nDCG@10, Recall@5/10/100, MRR@10 and latency for each pipeline and writes the table to the repository.",
      "A FastAPI service on Postgres with pgvector and an HNSW index. Answers come from any OpenAI-compatible model and cite their sources by number.",
    ],
    results: {
      columns: ["Retrieval", "nDCG@10", "Recall@5", "Recall@100"],
      rows: [
        ["BM25", "0.652", "0.728", "0.873"],
        ["Dense · bge-small", "0.713", "0.759", "0.942"],
        ["Hybrid · RRF", "0.709", "0.765", "0.965"],
        ["BM25 → cross-encoder", "0.682", "0.730", "0.866"],
        ["Dense → cross-encoder", "0.696", "0.754", "0.925"],
        ["Hybrid → cross-encoder", "0.697", "0.748", "0.947"],
      ],
      best: ["0.713", "0.765", "0.965"],
    },
    takeaway:
      "The hybrid goes behind the API: it has the best Recall@5, which is what decides the context an LLM receives. The web-trained reranker stays as an option, because on scientific claims it costs latency and quality.",
    figures: [],
    stack: ["sentence-transformers", "rank-bm25", "PostgreSQL", "pgvector", "FastAPI", "Docker", "pytest"],
  },
  "hybrid-recommender": {
    cover: { type: "pipeline" },
    language: "Python",
    facts: [
      ["What it does", "Matches people by their YouTube watch history"],
      ["Signals", "TF-IDF, sentence embeddings, ALS (32 factors)"],
      ["Re-ranking", "MMR with λ = 0.7 for diverse matches"],
      ["Cold start", "Separate path for users with under 10 videos"],
    ],
    problem:
      "Two people can share interests without watching a single video in common. Content similarity alone misses taste, collaborative filtering alone fails for new users, and a list of ten near-identical matches is useless.",
    approach: [
      "Each user gets a TF-IDF vector over titles, channels, tags and categories and a dense sentence-transformer embedding, both weighted toward recent views with a half-life of about 35 days.",
      "A User × Channel matrix factorised with ALS adds a collaborative signal once there is enough interaction data. Weights adapt per user to history size and category diversity.",
      "Maximal Marginal Relevance removes near-duplicate matches, and every match comes with its explanation: content similarity, shared videos and the weights used.",
    ],
    results: null,
    takeaway:
      "Built as a full product for the thesis: Google OAuth and Takeout import, a feed of matches with the reasons behind each one, real-time chat between matches, Docker deployment behind nginx.",
    figures: [],
    stack: ["FastAPI", "scikit-learn", "sentence-transformers", "implicit", "SQLAlchemy", "React", "Docker"],
  },
  "vessel-segmentation": {
    cover: { type: "image", src: "/images/vessel-panel-a-3.webp", width: 676, height: 640, alt: "Predicted retinal vessel heatmap", dark: true },
    language: "Python",
    facts: [
      ["Model", "DeepLabV3+ with an ImageNet ResNet-101 encoder"],
      ["Input", "Fundus photographs at 512 × 512"],
      ["Result", "Pixel IoU 0.944 on the test split, background included"],
      ["Training", "Dice loss, Adam, 50 epochs, best checkpoint by validation IoU"],
    ],
    problem:
      "Changes in retinal vessels are an early sign of diabetic retinopathy. Drawing vessel maps by hand is slow, and the thinnest capillaries are a few pixels wide.",
    approach: [
      "Masks one-hot encoded into background and vessel, images resized to 512 × 512.",
      "Heavy augmentation with Albumentations: flips, shift / scale / rotate, elastic and grid distortion, perspective, CLAHE, gamma, blur, noise and colour shifts.",
      "DeepLabV3+ from segmentation-models-pytorch, trained with Dice loss; validation loss tracks training loss for all 50 epochs.",
    ],
    results: {
      columns: ["Metric, test split", "Value"],
      rows: [
        ["Pixel IoU, averaged over background and vessel", "0.944"],
        ["Dice loss, same averaging", "0.031"],
      ],
      best: ["0.944"],
    },
    takeaway:
      "The averaged IoU flatters the model because background is most of each image. The next number to report is vessel-only Dice and sensitivity, where the thin capillaries matter.",
    figures: [
      { type: "image", src: "/images/vessel-segmentation.webp", width: 1400, height: 355, alt: "Fundus image, ground truth, prediction and heatmap", caption: "Input, ground truth, prediction and heatmap on a test image" },
      { type: "image", src: "/images/vessel-training-curves.webp", width: 1400, height: 616, alt: "Train and validation Dice loss over 50 epochs", caption: "Dice loss on train and validation over 50 epochs" },
    ],
    stack: ["PyTorch", "segmentation-models-pytorch", "Albumentations", "OpenCV"],
  },
  "brain-tumour-segmentation": {
    cover: { type: "image", src: "/images/brain-tumour-attention.webp", width: 820, height: 837, alt: "Attention maps of the Attention U-Net" },
    language: "Python",
    facts: [
      ["Input", "Four MRI sequences per 240 × 240 slice"],
      ["Output", "Necrotic core, edema, enhancing tumour"],
      ["Compared", "U-Net, slimmer U-Net, Attention U-Net"],
      ["Result", "Attention U-Net at about half the baseline's validation loss with ~3M parameters"],
    ],
    problem:
      "A tumour is not one region: the necrotic core, the edema around it and the enhancing tumour are treated differently, so the model has to separate them, not just find the tumour.",
    approach: [
      "Slices read from HDF5 with the four sequences (T1, T1 post-contrast, T2, FLAIR) stacked as channels and one mask channel per sub-region.",
      "A plain U-Net with ~5.5M parameters as the baseline, then a slimmer ~3M version with learning-rate decay, then an Attention U-Net with residual attention blocks trained for 25 epochs. Adam and binary cross-entropy throughout.",
      "The attention gates are returned in the forward pass and plotted, to see which decoder level does useful work.",
    ],
    results: {
      columns: ["Model", "Parameters", "Outcome"],
      rows: [
        ["U-Net", "~5.5 M", "Finds the tumour area, cannot separate sub-regions"],
        ["Slimmer U-Net + LR decay", "~3 M", "Lower validation loss with half the parameters"],
        ["Attention U-Net", "~3 M", "About half the first model's validation loss"],
      ],
      best: ["About half the first model's validation loss"],
    },
    takeaway:
      "The lowest-resolution attention map looks only at the area around the brain, which suggests that pathway adds little and is the first candidate to prune.",
    figures: [
      { type: "image", src: "/images/brain-mri-channels.webp", width: 900, height: 965, alt: "Four MRI sequences of one slice", caption: "The four input sequences of one slice", dark: true },
      { type: "image", src: "/images/brain-tumour-regions.webp", width: 964, height: 409, alt: "Predicted tumour sub-regions", caption: "Predicted sub-regions", dark: true },
      { type: "image", src: "/images/brain-learning-curve.webp", width: 851, height: 556, alt: "Training and validation loss of the Attention U-Net", caption: "Attention U-Net, training and validation loss" },
    ],
    stack: ["PyTorch", "h5py", "NumPy", "Matplotlib"],
  },
  "lora-fine-tuning-service": {
    cover: { type: "code" },
    language: "Python",
    facts: [
      ["Base model", "Meta Llama 3 8B Instruct"],
      ["Method", "4-bit quantisation with bitsandbytes and LoRA adapters"],
      ["Adapters", "r = 8, α = 16 on the query and value projections"],
      ["Interface", "FastAPI endpoints to upload dialogues and train"],
    ],
    problem:
      "Making a model write in one person's voice should not require a training notebook. A service that accepts dialogues and trains an adapter per speaker makes it a single API call.",
    approach: [
      "Dialogues are uploaded as JSON, and only the selected speaker's messages are kept as training text.",
      "The base model loads in 4-bit, LoRA adapters train on the attention projections, one adapter per speaker.",
      "Padding is excluded from the loss and the end-of-sequence token is used as padding, so the model learns only from real text.",
    ],
    results: null,
    takeaway:
      "There is no evaluation in the repository yet. The honest next step is held-out perplexity of the base model against the adapter, plus side-by-side samples.",
    figures: [],
    stack: ["FastAPI", "Transformers", "PEFT", "bitsandbytes", "Datasets"],
  },
  "real-estate-appraisal": {
    cover: { type: "flow" },
    language: "Python",
    facts: [
      ["Input", "A property described in plain language"],
      ["Parsing", "Gemini turns the text into structured features"],
      ["Prediction", "XGBoost regression pipeline"],
      ["Output", "A price estimate with an explanation"],
    ],
    problem:
      "People describe a property in a sentence, while a price model needs a fixed set of features. An LLM is good at the first part and bad at the second; a gradient-boosted model is the opposite.",
    approach: [
      "Gemini extracts bedrooms, bathrooms, location and area from the query into a fixed schema.",
      "A scikit-learn preprocessing pipeline and an XGBoost regressor predict the price.",
      "Gemini writes a plain-language explanation from the model inputs, all wrapped in a Gradio interface.",
    ],
    results: null,
    takeaway:
      "Each model does the part it is good at. The repository does not report a held-out error yet; that is the number to add before trusting the estimates.",
    figures: [],
    stack: ["Gemini", "XGBoost", "scikit-learn", "Gradio"],
  },
  "clip-retrieval": {
    cover: { type: "image", src: "/images/clip-search.webp", width: 1600, height: 335, alt: "CLIP search results for a turtle query" },
    language: "Python",
    facts: [
      ["Task", "Text-to-image and image-to-image search"],
      ["Models", "CLIP and ResNet-18 features"],
      ["Distances", "Cosine against Euclidean"],
      ["Data", "A small collection of photographs"],
    ],
    problem:
      "Searching photos by what is in them needs text and images in one space. CLIP provides that; an ImageNet classifier only compares images with images.",
    approach: [
      "CLIP embeds both the text query and the images, so a sentence can retrieve photographs.",
      "ResNet-18 penultimate-layer features serve as an image-only baseline.",
      "Both distance metrics are run on the same queries to compare the rankings.",
    ],
    results: null,
    takeaway: "The same embedding idea, applied to documents instead of photos, is the retrieval layer of the RAG service.",
    figures: [],
    stack: ["CLIP", "PyTorch", "NumPy", "Matplotlib"],
  },
};
