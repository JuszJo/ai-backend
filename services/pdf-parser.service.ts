//@ts-ignore
import pdfParse from "pdf-parse-debugging-disabled"
import { PINECONE_CONFIG } from "../config/pinecone.config.js";

import { pipeline } from "@huggingface/transformers";
import { normalizeFileName } from "../utils/uploadFile.js";
import { HF_TOKEN } from "../config/huggingface.config.js";

// Load MiniLM locally (auto-downloads the first time)
const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

const systemPrompts: Record<SummaryType, string> = {
  general: `
  You are an expert document summarizer. Create a clear, concise summary of the following document. Focus on:
  - Main topic and purpose
  - Key points and findings
  - Important conclusions
  - Any actionable insights

  Keep the summary well-structured and easy to read.`,

  executive: `
  You are creating an executive summary. Focus on:
  - Core business impact
  - Key decisions needed
  - Critical findings
  - Strategic implications
  - Bottom-line recommendations

  Write for senior leadership - be direct and actionable.`,

  academic: `
  You are summarizing an academic document. Include:
  - Research question/hypothesis
  - Methodology (if applicable)
  - Key findings and results
  - Conclusions and implications
  - Limitations or future research directions

  Maintain academic tone and precision.`,

  technical: `
  You are creating a technical summary. Focus on:
  - Technical specifications
  - Implementation details
  - System architecture or processes
  - Performance metrics
  - Technical recommendations

  Be precise and include relevant technical details.`
};

function generatePrompt(systemPrompt: string, text: string) {
  return `
  ${systemPrompt}
  Document to summarize: ${text}

  Summary:`;
}

type SummaryType = "general" | "executive" | "academic" | "technical";

// interface DocumentMetadata {
//   filename: string;
//   pages: number;
//   timestamp: string;
// }

interface ProcessedPDF {
  docId: string;
  text: string;
  pages: number;
}

interface SummarizeResult {
  summary: string;
  metadata: any;
}

export class PDFSummarizer {
  llmEndpoint: string;

  constructor(llmEndpoint = "http://127.0.0.1:8080") {
    this.llmEndpoint = llmEndpoint;
  }

  async processPDF(buffer: Buffer, filename: string): Promise<ProcessedPDF> {
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text.trim();

    if (!text) {
      throw new Error("No text found in PDF");
    }

    // Store full document in ChromaDB
    const normalizedName = normalizeFileName(filename)
    const docId = `${normalizedName}_${Date.now()}`;

    // Generate embeddings
    const embedding = await extractor(text, {
      pooling: "mean",   // average across tokens
      normalize: true    // normalize to unit length
    });

    await PINECONE_CONFIG.index.upsert([
      {
        id: docId,
        metadata: {
          filename,
          normalizedName,
          pages: pdfData.numpages,
          timestamp: new Date().toISOString(),
          text,
        },
        values: Array.from(embedding.data)
      }
    ])

    return { docId, text, pages: pdfData.numpages };
  }

  async summarizePDF(docId: string, summaryType: SummaryType = "general"): Promise<SummarizeResult> {
    const queryResponse = await PINECONE_CONFIG.index.fetch([docId]);

    const record = queryResponse.records?.[docId];

    if (!record) {
      throw new Error("Document not found");
    }

    const text = record.metadata?.text as string;
    const metadata = record.metadata;

    const systemPrompt = systemPrompts[summaryType] || systemPrompts.general;

    const prompt = generatePrompt(systemPrompt, text)

    const reqBody = {
      model: "google/gemma-2-2b-it",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: "help summarize this please"
        },
      ]
    }

    try {
      const response = await fetch(this.llmEndpoint + "/v1/chat/completions", {
        method: "POST",
        headers: {
          'Content-type': "application/json",
          'Authorization': `Bearer ${HF_TOKEN}`
        },
        body: JSON.stringify(reqBody)
        // max_tokens: 800,
        // temperature: 0.3,
      });

      if (!response.ok) {
        throw new Error(`Response error ${response.status}, ${response.statusText}`)
      }

      const data = await response.json()

      // console.log(data.choices);

      return {
        summary: data.response || data.choices?.[0]?.message.content || "",
        metadata: {
          summaryType,
          timestamp: new Date().toISOString(),
        },
      };
    }
    catch (error: any) {
      throw new Error(`LLM request failed: ${error.message}`);
    }
  }
}

const PDFService = {
  summarizer: new PDFSummarizer("https://router.huggingface.co")
}

export { PDFService }