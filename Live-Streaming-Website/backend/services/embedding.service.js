// Simple embedding service - placeholder for future NLP integration
// For now, returns a simple hash-based embedding

const crypto = require("crypto");

class EmbeddingService {
  async getEmbedding(text) {
    // Simple hash-based embedding for now
    // In production, this would use a proper NLP service like OpenAI, Cohere, etc.
    const hash = crypto.createHash("sha256").update(text).digest("hex");

    // Convert hash to a simple numeric array (32 numbers)
    const embedding = [];
    for (let i = 0; i < 32; i++) {
      const hexPair = hash.substr(i * 2, 2);
      embedding.push(parseInt(hexPair, 16) / 255); // Normalize to 0-1
    }

    return embedding;
  }

  async findSimilar(text, embeddings, threshold = 0.8) {
    const queryEmbedding = await this.getEmbedding(text);

    const similarities = embeddings.map((embedding, index) => {
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);
      return { index, similarity };
    });

    return similarities
      .filter((item) => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

module.exports = new EmbeddingService();
