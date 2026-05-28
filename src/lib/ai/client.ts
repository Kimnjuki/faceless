/**
 * AI Client — NVIDIA NIM powered inference for ContentAnonymity.com
 * OpenAI-compatible endpoint targeting: https://integrate.api.nvidia.com/v1
 * 
 * Gracefully falls back to canned responses when the API key is absent.
 */

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';

function getKey(): string | null {
  return import.meta.env.VITE_NVIDIA_API_KEY ?? null;
}

function getModel(): string {
  // Upgraded to 70B for significantly better reasoning. Override via VITE_NVIDIA_MODEL.
  return import.meta.env.VITE_NVIDIA_MODEL ?? 'meta/llama-3.1-70b-instruct';
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Options {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Chat completion via NVIDIA NIM.
 * Returns string content or empty string on failure.
 */
export async function chatCompletion(
  messages: Message[],
  opts: Options = {}
): Promise<string> {
  const apiKey = getKey();
  if (!apiKey) return fallbackResponse(messages);

  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystem = messages.filter(m => m.role !== 'system');

  try {
    const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [
          { role: 'system', content: systemMsg?.content ?? '' },
          ...nonSystem,
        ],
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[AIClient] NVIDIA error (${res.status}): ${err}`);
      return fallbackResponse(messages);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } catch (err) {
    console.warn('[AIClient] Request failed:', err);
    return fallbackResponse(messages);
  }
}

function fallbackResponse(messages: Message[]): string {
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const q = lastUser?.content?.toLowerCase() ?? '';

  if (q.includes('guide') || q.includes('roadmap') || q.includes('step')) {
    return 'Here\'s a quick roadmap: 1) Pick your niche, 2) Choose a content format (shorts, tutorials, voiceovers), 3) Set up automated workflows with AI tools, 4) Scale with repurposing. Check the Creator Roadmap for a personalized plan.';
  }
  if (q.includes('niche') || q.includes('topic')) {
    return 'Popular faceless content niches include: tech explainers, gaming clips with commentary, motivational content, finance tips, and educational shorts. Use the Niche Quiz to find your best fit based on your skills and interests.';
  }
  if (q.includes('monetize') || q.includes('money') || q.includes('income')) {
    return 'Monetization options for faceless content: ad revenue (YouTube Partner Program), brand sponsorships, affiliate marketing for tools you use, digital products (templates, presets), and paid communities. Start with the Monetization Matcher tool.';
  }
  if (q.includes('tool') || q.includes('software') || q.includes('start')) {
    return 'Essential tools for faceless creators: ElevenLabs for voiceover, CapCut/DaVinci Resolve for editing, ChatGPT/Claude for scripting, Canva for thumbnails, and VidIQ/TubeBuddy for growth analytics.';
  }
  return 'I analyze content creation workflows and recommend strategies based on your niche and goals. Check the Creator Roadmap, Niche Quiz, or Monetization Matcher for personalized recommendations.';
}
