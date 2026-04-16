import { GraphNode, GraphEdge } from "@/types/graph";

export const seedNodes: GraphNode[] = [
  {
    id: "1",
    title: "Machine Learning",
    note: "A field of AI that enables systems to learn from data without explicit programming.",
    tags: ["ai", "core"],
  },
  {
    id: "2",
    title: "Neural Networks",
    note: "Computing systems loosely modeled on biological brains, consisting of layers of interconnected nodes.",
    tags: ["ai", "deep-learning"],
  },
  {
    id: "3",
    title: "Python",
    note: "The dominant language for ML/AI work due to its readable syntax and rich ecosystem.",
    tags: ["language"],
  },
  {
    id: "4",
    title: "Data Preprocessing",
    note: "Transforming raw data into a clean, normalized format suitable for model training.",
    tags: ["workflow"],
  },
  {
    id: "5",
    title: "Model Evaluation",
    note: "Measuring model performance via metrics such as accuracy, F1, AUC-ROC, and RMSE.",
    tags: ["workflow"],
  },
  {
    id: "6",
    title: "Overfitting",
    note: "When a model learns training data too well and fails to generalize to unseen examples.",
    tags: ["concept"],
  },
  {
    id: "7",
    title: "Transformers",
    note: "Attention-based architecture that powers modern LLMs, introduced in Attention Is All You Need (2017).",
    tags: ["architecture", "deep-learning"],
  },
  {
    id: "8",
    title: "Embeddings",
    note: "Dense vector representations of data (text, images, graphs) in a continuous feature space.",
    tags: ["concept"],
  },
];

export const seedEdges: GraphEdge[] = [
  { id: "e1", source: "2", target: "1", label: "subset of" },
  { id: "e2", source: "1", target: "3", label: "implemented in" },
  { id: "e3", source: "1", target: "4", label: "requires" },
  { id: "e4", source: "1", target: "5", label: "measured by" },
  { id: "e5", source: "6", target: "5", label: "detected via" },
  { id: "e6", source: "7", target: "2", label: "type of" },
  { id: "e7", source: "7", target: "8", label: "produces" },
  { id: "e8", source: "4", target: "6", label: "reduces" },
  { id: "e9", source: "8", target: "1", label: "used in" },
];
