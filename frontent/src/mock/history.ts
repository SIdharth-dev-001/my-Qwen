import { Conversation } from '../types/conversation';

const now = new Date();
const yesterday = new Date();
yesterday.setDate(now.getDate() - 1);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(now.getDate() - 3);
const tenDaysAgo = new Date();
tenDaysAgo.setDate(now.getDate() - 10);

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-python-dec',
    title: 'Python Decorators Tutorial',
    model: 'Qwen 2.5 Instruct',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    isFavorite: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Explain Python decorators simply please.',
        timestamp: now.toISOString()
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `### Python Decorators: Under the Hood

A **decorator** in Python is simply a function that takes another function as an argument, extends or modifies its behavior, and returns a new function, all without modifying the original source code.

Think of it like putting a protective, custom-designed wrapper around a package.

\`\`\`python
def measure_time(func):
    def wrapper(*args, **kwargs):
        # Extend behavior here
        return func(*args, **kwargs)
    return wrapper
\`\`\`

Let me know if you would like to see a complete working script measuring execution metrics!`,
        timestamp: now.toISOString()
      }
    ]
  },
  {
    id: 'conv-saas-schema',
    title: 'SaaS JSON Profile Schema',
    model: 'Qwen 2.5 Coder',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
    isFavorite: false,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Can you generate a JSON Schema for a SaaS user profile?',
        timestamp: yesterday.toISOString()
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'Sure! Here is a clean user profile schema including tiers and billing details:\n\n```json\n{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "title": "SaaSUserProfile",\n  "type": "object",\n  "required": ["id", "email", "subscription"]\n}\n```\nLet me know if you require team permissions added.',
        timestamp: yesterday.toISOString()
      }
    ]
  },
  {
    id: 'conv-launch-email',
    title: 'My Qwen Launch Announcement',
    model: 'Qwen Max',
    createdAt: threeDaysAgo.toISOString(),
    updatedAt: threeDaysAgo.toISOString(),
    isFavorite: true,
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'Draft a premium product announcement email for My Qwen.',
        timestamp: threeDaysAgo.toISOString()
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'Here is the high-fidelity draft:\n\n**Subject: Introducing My Qwen 🚀 | Elegant AI Intelligence on a Fluid Canvas**\n\nHi {{name}},\n\nWe are absolutely thrilled to introduce **My Qwen**...',
        timestamp: threeDaysAgo.toISOString()
      }
    ]
  },
  {
    id: 'conv-anova-pandas',
    title: 'ANOVA Statistical Testing',
    model: 'Qwen 2.5 Math',
    createdAt: tenDaysAgo.toISOString(),
    updatedAt: tenDaysAgo.toISOString(),
    isFavorite: false,
    messages: [
      {
        id: 'msg-7',
        role: 'user',
        content: 'Explain ANOVA in Pandas.',
        timestamp: tenDaysAgo.toISOString()
      },
      {
        id: 'msg-8',
        role: 'assistant',
        content: 'Analysis of Variance (ANOVA) calculates if multiple group means differ significantly. Here is how we perform it:\n\n```python\nimport scipy.stats as stats\nf_val, p_val = stats.f_oneway(*groups)\n```',
        timestamp: tenDaysAgo.toISOString()
      }
    ]
  }
];
