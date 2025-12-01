import Constants from 'expo-constants';

const GEMINI_PROXY_URL = Constants.expoConfig?.extra?.GEMINI_PROXY_URL || 'https://your-vercel-app.vercel.app/api/gemini-generate-emoji';

interface EmojiGenerationRequest {
  prompt: string;
  style: 'cartoon' | 'realistic' | 'pixel' | 'anime' | 'minimalist';
  category: string;
  size?: 'small' | 'medium' | 'large';
}

interface EmojiGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  generationTime?: number;
}

export class EmojiGenerationService {
  private static instance: EmojiGenerationService;
  private userId: string = 'anonymous';

  private constructor() {}

  static getInstance(): EmojiGenerationService {
    if (!this.instance) {
      this.instance = new EmojiGenerationService();
    }
    return this.instance;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  async generateEmoji(request: EmojiGenerationRequest): Promise<EmojiGenerationResponse> {
    try {
      // 验证请求参数
      if (!request.prompt || !request.style || !request.category) {
        return {
          success: false,
          error: 'Missing required parameters: prompt, style, and category are required',
        };
      }

      // 构建请求体
      const requestBody = {
        prompt: request.prompt.trim(),
        style: request.style,
        category: request.category,
        size: request.size || 'medium',
        userId: this.userId,
      };

      // 调用代理服务
      const response = await fetch(GEMINI_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Proxy service error:', response.status, errorText);
        return {
          success: false,
          error: `Proxy service error: ${response.status} ${response.statusText}`,
        };
      }

      const result = await response.json();
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Unknown error from proxy service',
        };
      }

      return {
        success: true,
        imageUrl: result.imageUrl,
        generationTime: result.generationTime,
      };

    } catch (error) {
      console.error('Emoji generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate emoji',
      };
    }
  }

  async generateBatchEmoji(requests: EmojiGenerationRequest[]): Promise<EmojiGenerationResponse[]> {
    const results: EmojiGenerationResponse[] = [];
    
    // 限制并发数量以避免过载
    const batchSize = 3;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(request => this.generateEmoji(request))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  validatePrompt(prompt: string): { valid: boolean; error?: string } {
    if (!prompt || prompt.trim().length === 0) {
      return { valid: false, error: 'Prompt cannot be empty' };
    }

    if (prompt.length > 200) {
      return { valid: false, error: 'Prompt is too long (max 200 characters)' };
    }

    // 检查不当内容
    const inappropriatePatterns = [
      /personal\s+data/i,
      /private\s+information/i,
      /copyright/i,
      /trademark/i,
      /nsfw/i,
      /adult/i,
      /violence/i,
    ];

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(prompt)) {
        return { valid: false, error: 'Prompt contains inappropriate content' };
      }
    }

    return { valid: true };
  }

  getAvailableStyles(): string[] {
    return ['cartoon', 'realistic', 'pixel', 'anime', 'minimalist'];
  }

  getAvailableSizes(): string[] {
    return ['small', 'medium', 'large'];
  }

  getAvailableCategories(): string[] {
    return [
      'face',
      'animal',
      'food',
      'nature',
      'activity',
      'object',
      'symbol',
      'flag',
      'custom'
    ];
  }
}

export default EmojiGenerationService;