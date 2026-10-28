export const GAMES = [
  {
    slug: "draw-a-digit",
    title: "Draw a digit",
    topic: "Deep learning",
    teaser: "A network I trained reads your handwriting live, right in the browser.",
    lead: "Write any digit with your mouse or finger. The network reads it as you draw.",
    description:
      "Draw a digit and watch a neural network I trained on MNIST read it live in your browser, with the probability of every class.",
  },
  {
    slug: "spot-the-model",
    title: "Spot the model",
    topic: "Computer vision",
    teaser: "Twelve retinal scans. Tell a human expert's vessel mask from my model's.",
    lead: "Each round shows a retinal photo and two vessel masks. One is drawn by a human expert, the other by my DeepLabV3+ model. Pick the model.",
    description:
      "Twelve retinal scans, two vessel masks each: one drawn by a human expert, one by my DeepLabV3+ segmentation model. Can you tell which is which?",
  },
  {
    slug: "descent",
    title: "Descent",
    topic: "Optimisation",
    teaser: "Tune the learning rate and momentum and roll a model into the global minimum.",
    lead: "Training is a ball rolling downhill on a loss landscape. Pick a start, a learning rate and momentum, and try to reach the deepest basin in as few steps as you can.",
    description:
      "Gradient descent as a game: pick a learning rate and momentum and roll a model into the global minimum of a loss landscape in as few steps as you can.",
  },
  {
    slug: "draw-the-boundary",
    title: "Draw the boundary",
    topic: "Neural networks",
    teaser: "Place points and watch a neural network learn to separate them in real time.",
    lead: "A small neural network learns to separate blue points from black ones while you watch. Click to add points, change its width, and find the smallest network that still solves the spiral.",
    description:
      "Place points and watch a small neural network, written from scratch with Adam, learn a decision boundary in real time. Solve the spiral with as few neurons as you can.",
  },
  {
    slug: "beat-the-model",
    title: "Beat the model",
    topic: "Machine learning",
    teaser: "Rock, paper, scissors against a model that learns your habits as you play.",
    lead: "Rock, paper, scissors against a model that learns your habits while you play. Try to stay random: almost nobody can for long.",
    description:
      "Rock, paper, scissors against a Markov model that learns your habits while you play. Most people lose within thirty rounds.",
  },
  {
    slug: "be-a-convolution",
    title: "Be a convolution",
    topic: "Computer vision",
    teaser: "Write a 3 × 3 filter and watch the feature map a CNN would see.",
    lead: "Write the 3 × 3 filter yourself and see the feature map a convolutional network would compute from a retinal scan, or from your own photo.",
    description:
      "Edit a 3 × 3 convolution kernel and see the feature map a CNN computes from a retinal scan or your own photo: edges, sharpening, blur and emboss.",
  },
  {
    slug: "overfit",
    title: "Overfit",
    topic: "Generalisation",
    teaser: "Raise the polynomial degree and watch the training error fall while the test error explodes.",
    lead: "Fit a curve to sixteen noisy points. Every extra degree lowers the training error, but only one setting predicts new points best. Find it.",
    description:
      "Fit a polynomial to noisy data and watch training error fall while test error explodes: an interactive lesson in overfitting and generalisation.",
  },
  {
    slug: "diversity-dial",
    title: "Diversity dial",
    topic: "Recommender systems",
    teaser: "Turn one dial and watch a recommender trade relevance for variety, the way MMR does.",
    lead: "Six people get recommended to you. Turn λ down and Maximal Marginal Relevance swaps near-copies of you for matches from other interests. Find the balance.",
    description:
      "Play with Maximal Marginal Relevance: turn the λ dial and watch a people recommender trade relevance for diversity, the re-ranking my thesis recommender uses.",
  },
];
