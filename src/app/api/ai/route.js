import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req) {
  const { messages, system } = await req.json();
  try {
    const r = await client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system, messages });
    return Response.json({ content: r.content[0].text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}