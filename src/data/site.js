export const SITE = {
  name: "Vadim Tkachenko",
  role: "AI Engineer",
  email: "vadim.tkach1378@gmail.com",
  github: "https://github.com/vadimtkacj1",
  linkedin: "https://www.linkedin.com/in/vadim-tkachenko-19842b241",
};

export const NAV = [
  { id: "work", label: "Work" },
  { page: "/services", label: "Services" },
  { page: "/about", label: "About" },
  { page: "/writing", label: "Writing" },
  { page: "/playground", label: "Playground" },
  { page: "/contact", label: "Contact" },
];

export function navHref(item, path) {
  if (item.page) return item.page;
  if (item.id === "contact" || path === "/") return `#${item.id}`;
  return `/#${item.id}`;
}

export const PROJECTS = [
  {
    slug: "rag-eval-service",
    name: "RAG Eval",
    title: "RAG service with a retrieval benchmark",
    category: "LLM · Retrieval",
    result: "nDCG@10 0.713 · 6 pipelines",
    summary:
      "Six retrieval pipelines measured on BEIR SciFact before one goes behind the API: the hybrid wins Recall@5, and an out-of-domain reranker makes results worse.",
    repo: "https://github.com/vadimtkacj1/rag-eval-service",
    media: { type: "table" },
  },
  {
    slug: "hybrid-recommender",
    name: "Social Search",
    title: "Social Search: hybrid people recommender",
    category: "Recommender · Thesis",
    result: "TF-IDF + embeddings + ALS, MMR",
    summary:
      "Matches people with similar interests from their YouTube watch history and explains every match, with real-time chat between matches.",
    repo: "https://github.com/vadimtkacj1/hybrid-recommendation-system-diplom",
    media: { type: "pipeline" },
  },
  {
    slug: "vessel-segmentation",
    name: "Vessel Segmentation",
    title: "Retinal vessel segmentation",
    category: "Computer vision",
    result: "Pixel IoU 0.944 · DeepLabV3+",
    summary: "Pixel-level segmentation of blood vessels in fundus photographs for diabetic retinopathy screening.",
    repo: "https://github.com/vadimtkacj1/vessel-segmentation",
    media: { type: "image", src: "/images/vessel-segmentation.webp", width: 1400, height: 355, alt: "Fundus photograph, ground truth, predicted vessels and heatmap" },
  },
  {
    slug: "brain-tumour-segmentation",
    name: "Brain Tumour",
    title: "Brain tumour segmentation with attention",
    category: "Medical imaging",
    result: "Attention U-Net · ½ the loss",
    summary: "Segments three tumour sub-regions from four MRI sequences and visualises what the attention gates look at.",
    repo: "https://github.com/vadimtkacj1/brain-tumour-segmentation",
    media: { type: "image", src: "/images/brain-tumour-attention.webp", width: 820, height: 837, alt: "Attention maps from four decoder levels" },
  },
  {
    slug: "lora-fine-tuning-service",
    name: "LoRA Service",
    title: "LoRA fine-tuning service",
    category: "LLM fine-tuning",
    result: "Llama 3 8B · 4-bit QLoRA",
    summary: "A REST service that fine-tunes Llama 3 8B on one speaker's messages so it writes in that speaker's voice.",
    repo: "https://github.com/vadimtkacj1/fine-tuning-llama",
    media: { type: "code" },
  },
  {
    slug: "real-estate-appraisal",
    name: "Price Assistant",
    title: "Real estate price assistant",
    category: "LLM + XGBoost",
    result: "Parse · predict · explain",
    summary: "An LLM turns a free-text listing into features, XGBoost predicts the price, the LLM explains the estimate.",
    repo: "https://github.com/vadimtkacj1/real-estate-appraisal-agent",
    media: { type: "flow" },
  },
  {
    slug: "clip-retrieval",
    name: "CLIP Search",
    title: "Image search with CLIP",
    category: "Embeddings",
    result: "CLIP vs ResNet-18",
    summary: "Text-to-image and image-to-image search, comparing CLIP with ResNet-18 features and two distance metrics.",
    repo: "https://github.com/vadimtkacj1/clip-retrieval-ai",
    media: { type: "image", src: "/images/clip-search.webp", width: 1600, height: 335, alt: "Top five CLIP results for a photo of a turtle swimming in the ocean" },
  },
];

export const GALLERY = [
  { src: "/images/vessel-panel-a-0.webp", width: 676, height: 640, title: "Input", note: "Retinal fundus photograph", project: "Vessel segmentation" },
  { src: "/images/vessel-panel-a-2.webp", width: 676, height: 640, title: "Prediction", note: "Vessel mask from DeepLabV3+", project: "Vessel segmentation", dark: true },
  { src: "/images/vessel-panel-a-3.webp", width: 676, height: 640, title: "Confidence", note: "Per-pixel vessel heatmap", project: "Vessel segmentation" },
  { src: "/images/brain-mri-channels.webp", width: 900, height: 965, title: "Input", note: "Four MRI sequences of one slice", project: "Brain tumour", dark: true },
  { src: "/images/brain-tumour-regions.webp", width: 964, height: 409, title: "Prediction", note: "Necrotic core, edema, enhancing tumour", project: "Brain tumour", dark: true },
  { src: "/images/brain-tumour-attention.webp", width: 820, height: 837, title: "Attention", note: "What four decoder levels look at", project: "Brain tumour" },
  { src: "/images/clip-search.webp", width: 1600, height: 335, title: "Retrieval", note: "Top five CLIP results for a text query", project: "CLIP search" },
  { src: "/images/vessel-panel-b-3.webp", width: 676, height: 640, title: "Prediction", note: "A second test sample", project: "Vessel segmentation", dark: true },
];

export const SERVICES = [
  {
    slug: "llm-applications",
    title: "LLM applications",
    text: "Structured extraction, tool-calling assistants and LoRA / QLoRA fine-tuning, wired into real APIs instead of demos.",
    tools: ["Transformers", "PEFT", "bitsandbytes", "OpenAI", "Claude", "Gemini"],
    lead: "Assistants, search over your documents and fine-tuned models that answer from your data, measured before they go live.",
    deliverables: [
      ["Search over your documents", "Retrieval-augmented generation with the retriever chosen by a benchmark on your own questions, not by habit."],
      ["Structured extraction", "Turning free text, emails or forms into clean fields your systems can use, with validation."],
      ["Fine-tuning", "LoRA and QLoRA adapters on open models such as Llama 3 when prompting alone is not enough."],
      ["Evaluation", "A test set and a script that scores every change, so quality is a number and not an impression."],
    ],
    projects: ["rag-eval-service", "lora-fine-tuning-service", "real-estate-appraisal"],
    description:
      "LLM application development by Vadim Tkachenko: retrieval-augmented generation over your documents, structured extraction, LoRA fine-tuning and evaluation.",
  },
  {
    slug: "computer-vision",
    title: "Computer vision",
    text: "Segmentation, retrieval and classification models: trained, evaluated with a number you can check, and visualised.",
    tools: ["PyTorch", "segmentation-models", "OpenCV", "CLIP", "Albumentations"],
    lead: "Models that find, outline and compare what is in an image, trained on your data and judged by a metric you can check.",
    deliverables: [
      ["Segmentation", "Pixel-level masks for objects or regions, as in my retinal vessel and brain tumour models."],
      ["Image search", "Find photos by a sentence or by a similar photo with CLIP embeddings."],
      ["Classification", "Sort images into your categories, with the confusion matrix to show where it fails."],
      ["Visual explanations", "Heatmaps and attention maps that show what the model looks at."],
    ],
    projects: ["vessel-segmentation", "brain-tumour-segmentation", "clip-retrieval"],
    description:
      "Computer vision development by Vadim Tkachenko: image segmentation, classification and CLIP image search in PyTorch, trained and evaluated on your data.",
  },
  {
    slug: "recommenders-and-production",
    title: "Ranking & production",
    text: "Hybrid recommenders with diversity and cold start, served by FastAPI with the frontend that people actually use.",
    tools: ["scikit-learn", "implicit", "FastAPI", "Docker", "React", "Next.js"],
    lead: "Recommendations and ranking that explain themselves, served by an API and an interface people use every day.",
    deliverables: [
      ["Recommender systems", "Content and collaborative signals combined, with a separate path for new users and diversity re-ranking."],
      ["APIs and services", "FastAPI services on Postgres in Docker, with tests and continuous integration."],
      ["Product frontend", "React and Next.js interfaces for the model, so it reaches users instead of a notebook."],
      ["Deployment", "Running on your server or cloud, behind nginx, with the setup written down."],
    ],
    projects: ["hybrid-recommender", "rag-eval-service"],
    description:
      "Recommender systems and production ML by Vadim Tkachenko: hybrid ranking with cold start and diversity, FastAPI services, Docker and React frontends.",
  },
];

export const METRICS = [
  { value: "0.944", label: "pixel IoU, vessel segmentation" },
  { value: "8", suffix: "B", label: "parameter Llama 3, QLoRA-tuned" },
  { value: "3", label: "ranking signals in one recommender" },
  { value: "7", label: "projects with public code" },
];

export const EXPERIENCE = [
  {
    title: "Production CRM",
    detail: "Meta Ads analytics panel and online payments, running in production on its own server.",
    stack: "FastAPI · React · Docker",
  },
  {
    title: "Restaurant platform",
    detail: "Dynamic QR-code menus with real-time inventory tracking and personalised recommendations.",
    stack: "React · FastAPI",
  },
  {
    title: "Business websites",
    detail: "Fast, search-optimised sites for legal, beauty and interior-design businesses.",
    stack: "Next.js · TypeScript",
  },
];
