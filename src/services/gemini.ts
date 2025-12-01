import Constants from 'expo-constants';

// 从Expo配置中获取代理URL
const expoConfig = Constants.expoConfig?.extra?.expoConfig;
const GEMINI_PROXY_URL = expoConfig?.geminiProxyUrl || 'https://your-proxy-url.vercel.app/api/gemini-generate-emoji';

export interface EmojiGenerationRequest {
  prompt: string;
  style: 'cartoon' | 'realistic' | 'pixel' | 'anime' | 'minimalist';
  category: string;
  size?: 'small' | 'medium' | 'large';
}

export interface EmojiGenerationResponse {
  success: boolean;
  imageUrl: string;
  metadata: {
    prompt: string;
    style: string;
    category: string;
    generationTime: number;
    modelVersion: string;
  };
}

export interface PromptValidationResponse {
  valid: boolean;
  reason?: string;
  suggestions?: string[];
}

export class GeminiService {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private modelName = 'gemini-2.0-flash-exp';

  constructor() {
    // 不再直接存储API密钥，改为使用代理服务
  }

  async generateEmoji(request: EmojiGenerationRequest): Promise<EmojiGenerationResponse> {
    try {
      // 构建优化的提示词
      const enhancedPrompt = this.buildEmojiPrompt(request);
      
      // 调用Gemini API生成图像
      const response = await this.callGeminiAPI(enhancedPrompt);
      
      // 处理响应
      const processedImage = await this.processGeneratedImage(response);
      
      return {
        success: true,
        imageUrl: processedImage.url,
        metadata: {
          prompt: request.prompt,
          style: request.style,
          category: request.category,
          generationTime: response.generationTime,
          modelVersion: this.modelName,
        },
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to generate emoji: ${error.message}`);
    }
  }

  async validatePrompt(prompt: string): Promise<PromptValidationResponse> {
    try {
      // 检查提示词长度
      if (prompt.length < 3) {
        return {
          valid: false,
          reason: 'Prompt too short. Please provide a more detailed description.',
        };
      }

      if (prompt.length > 500) {
        return {
          valid: false,
          reason: 'Prompt too long. Please keep it under 500 characters.',
        };
      }

      // 检查不当内容
      const inappropriateWords = [
        'violence', 'hate', 'discrimination', 'nsfw', 'adult',
        'explicit', 'gore', 'harassment', 'bullying'
      ];

      const lowerPrompt = prompt.toLowerCase();
      const foundInappropriate = inappropriateWords.some(word => 
        lowerPrompt.includes(word)
      );

      if (foundInappropriate) {
        return {
          valid: false,
          reason: 'Inappropriate content detected. Please provide a family-friendly description.',
        };
      }

      // 提供改进建议
      const suggestions = this.generatePromptSuggestions(prompt);

      return {
        valid: true,
        suggestions,
      };
    } catch (error) {
      console.error('Prompt validation error:', error);
      return {
        valid: false,
        reason: 'Failed to validate prompt.',
      };
    }
  }

  private buildEmojiPrompt(request: EmojiGenerationRequest): string {
    const { prompt, style, category } = request;
    
    // 风格特定的提示词增强
    const stylePrompts = {
      cartoon: 'cartoon style, vibrant colors, simple shapes, friendly expression',
      realistic: 'realistic style, detailed textures, natural lighting, photographic quality',
      pixel: 'pixel art style, 8-bit aesthetic, retro gaming look, sharp edges',
      anime: 'anime style, Japanese animation aesthetic, expressive eyes, clean lines',
      minimalist: 'minimalist style, simple geometric shapes, clean design, limited colors',
    };

    // 类别特定的提示词增强
    const categoryPrompts = {
      'smiley': 'emoji face, expressive emotion',
      'animal': 'cute animal, friendly expression',
      'food': 'delicious food item, appetizing appearance',
      'nature': 'natural element, organic shapes',
      'activity': 'action or activity, dynamic pose',
      'object': 'everyday object, clear silhouette',
      'symbol': 'symbolic representation, universal meaning',
      'flag': 'flag design, national colors',
    };

    const styleEnhancement = stylePrompts[style] || stylePrompts.cartoon;
    const categoryEnhancement = categoryPrompts[category.toLowerCase()] || 'emoji design';
    
    // 构建最终提示词
    return `Create a ${categoryEnhancement} emoji in ${styleEnhancement}. 
            The emoji should be: ${prompt}
            
            Requirements:
            - Square format, suitable for emoji use
            - Clear and recognizable at small sizes
            - Transparent or solid background
            - High quality, professional design
            - Appropriate for all ages
            - No text or words in the image`;
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    const url = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const generationTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    // 检查是否有安全过滤
    if (result.promptFeedback && result.promptFeedback.blockReason) {
      throw new Error(`Content blocked: ${result.promptFeedback.blockReason}`);
    }

    return {
      ...result,
      generationTime,
    };
  }

  private async processGeneratedImage(response: any): Promise<{ url: string }> {
    // 注意：Gemini 2.0 Flash目前主要用于文本生成
    // 对于图像生成，我们需要使用其他Google AI服务或集成
    // 这里提供一个模拟的实现，实际项目中需要替换为真实的图像生成服务
    
    try {
      // 模拟图像生成过程
      // 在实际项目中，这里应该调用Google的图像生成API或其他图像生成服务
      const mockImageUrl = await this.generateMockEmojiImage(response);
      
      return {
        url: mockImageUrl,
      };
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process generated image');
    }
  }

  private async generateMockEmojiImage(response: any): Promise<string> {
    // 这是一个模拟实现，实际项目中应该替换为真实的图像生成
    // 可以考虑使用：
    // 1. Google Imagen API
    // 2. Stable Diffusion API
    // 3. DALL-E API
    // 4. 其他图像生成服务
    
    // 临时返回一个占位符图像URL
    // 在实际项目中，这里应该生成真实的图像
    return `https://via.placeholder.com/512x512.png?text=Emoji+Generated`;
  }

  private generatePromptSuggestions(prompt: string): string[] {
    const suggestions = [];
    
    // 基于当前提示词生成建议
    if (prompt.length < 20) {
      suggestions.push('Add more descriptive details');
    }
    
    if (!prompt.includes('color') && !prompt.includes('colour')) {
      suggestions.push('Specify colors');
    }
    
    if (!prompt.includes('style') && !prompt.includes('look')) {
      suggestions.push('Describe the artistic style');
    }
    
    if (!prompt.includes('expression') && !prompt.includes('emotion')) {
      suggestions.push('Add emotional expression');
    }
    
    return suggestions.slice(0, 2); // 返回最多2个建议
  }

  // GDPR合规性方法
  async logDataProcessing(
    userId: string,
    processingType: string,
    dataCategories: string[],
    legalBasis: string,
    additionalInfo?: Record<string, any>
  ): Promise<void> {
    try {
      // 记录数据处理活动，确保GDPR合规
      const logData = {
        user_id: userId,
        processing_type: processingType,
        data_categories: dataCategories,
        legal_basis: legalBasis,
        timestamp: new Date().toISOString(),
        ip_address: additionalInfo?.ipAddress || 'unknown',
        user_agent: additionalInfo?.userAgent || 'unknown',
        ...additionalInfo,
      };

      // 这里应该将日志发送到您的合规日志系统
      console.log('GDPR Data Processing Log:', JSON.stringify(logData, null, 2));
      
      // 在实际项目中，这里应该将日志发送到后端服务进行永久存储
      // await this.sendToComplianceLog(logData);
      
    } catch (error) {
      console.error('Failed to log data processing:', error);
      // 不要抛出错误，确保主功能不受影响
    }
  }

  // 获取数据处理透明度信息
  getDataProcessingInfo(): {
    purpose: string;
    legalBasis: string;
    dataRetention: string;
    thirdParties: string[];
    userRights: string[];
  } {
    return {
      purpose: 'Generate custom emoji images based on user text prompts',
      legalBasis: 'User consent (Article 6(1)(a) GDPR)',
      dataRetention: 'User data retained until account deletion or 2 years of inactivity',
      thirdParties: ['Google Cloud Platform (Gemini API)'],
      userRights: [
        'Right to access your data',
        'Right to rectification of inaccurate data',
        'Right to erasure (right to be forgotten)',
        'Right to data portability',
        'Right to object to processing',
        'Right to withdraw consent at any time',
      ],
    };
  }
}

export const geminiService = new GeminiService();