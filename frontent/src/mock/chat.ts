import { Message } from '../types/chat';

export const MOCK_QWEN_ANSWERS: Record<string, string> = {
  'explain-python': `### Python Decorators: Under the Hood

A **decorator** in Python is simply a function that takes another function as an argument, extends or modifies its behavior, and returns a new function, all without modifying the original source code.

Think of it like putting a protective, custom-designed wrapper around a package.

#### The Code Example: Measuring Execution Time

Here is a clean, production-grade decorator designed to measure the execution time of any function:

\`\`\`python
import time
from functools import wraps

def measure_time(func):
    """
    A decorator that measures and prints the execution time
    of the decorated function.
    """
    @wraps(func) # Preserves the original function's metadata
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        
        # Execute the original function
        result = func(*args, **kwargs)
        
        end_time = time.perf_counter()
        execution_time = end_time - start_time
        print(f"⏱️  Function '{func.__name__}' executed in {execution_time:.6f} seconds")
        return result
    return wrapper

# How to use the decorator:
@measure_time
def process_heavy_dataset(size):
    """Simulates calculating a large mathematical sequence."""
    total = sum(i * 2 for i in range(size))
    return total

# Triggering the decorated function
result = process_heavy_dataset(10_000_000)
\`\`\`

#### Key Takeaways:
1. **\`*args\` and \`**kwargs\`** ensure that the wrapper can accept any parameters the original function requires.
2. **\`@wraps(func)\`** from \`functools\` is highly recommended so your decorated function retains its original name and docstrings!`,

  'generate-json': `### Premium SaaS User Profile Schema

Below is a complete, draft-ready JSON Schema describing a comprehensive software-as-a-service (SaaS) subscriber, designed to enforce high data-integrity in standard relational or document storage engines.

\`\`\`json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SaaSUserProfile",
  "type": "object",
  "required": ["id", "email", "subscription", "team"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "profile": {
      "type": "object",
      "properties": {
        "fullName": { "type": "string" },
        "avatarUrl": { "type": "string", "format": "uri" },
        "timezone": { "type": "string", "default": "UTC" }
      }
    },
    "subscription": {
      "type": "object",
      "required": ["plan", "status", "billingCycle"],
      "properties": {
        "plan": {
          "type": "string",
          "enum": ["free", "starter", "premium-pro", "enterprise-tier"]
        },
        "status": {
          "type": "string",
          "enum": ["active", "trialing", "past_due", "canceled"]
        },
        "billingCycle": {
          "type": "string",
          "enum": ["monthly", "annually"]
        }
      }
    },
    "team": {
      "type": "object",
      "required": ["organizationId", "role"],
      "properties": {
        "organizationId": { "type": "string", "format": "uuid" },
        "role": {
          "type": "string",
          "enum": ["owner", "admin", "collaborator", "billing_manager", "viewer"]
        },
        "permissions": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
\`\`\`

This standard schema covers:
*   Granular organizational permissions
*   Strict UUID and Email formatting
*   Detailed Subscription cycle states`,

  'write-email': `Subject: Introducing My Qwen 🚀 | Elegant AI Intelligence on a Fluid Canvas

Hi {{name}},

We are absolutely thrilled to introduce **My Qwen**, your new personal AI assistant engineered for high-performance reasoning on a premium fluid interface.

Built directly upon the Qwen-2.5 framework, My Qwen is fine-tuned to help you debug complex code, craft engaging copy, parse large statistics, and organize thoughts on an interface that respects your focus.

### What makes My Qwen different?
*   ✨ **Fluid Interactive Canvas**: Crafted with glassmorphism layouts, soft neon glows, and micro-animated transitions where nothing feels static.
*   🌑 **Eye-Safe Midnight Palette**: A pristine dark slate design optimized to keep cognitive fatigue at bay during long editing sessions.
*   💻 **Specialist Sub-models**: Effortlessly toggle between standard Qwen, Qwen Coder, and Qwen Math to fit the precise rhythm of your task.
*   💾 **Persistent Context**: Instantly access search-indexed historic chats and restore context in one tap.

Try My Qwen today and elevate your productivity to a state of flow.

Best regards,
**The My Qwen Design & Engineering Team**`,

  'summarize-csv': `### Tabular ANOVA with Pandas

Analysis of Variance (**ANOVA**) is a robust statistical method used to test if the means of three or more independent groups are significantly different from one another.

#### Practical Pandas script:

Here is a ready-to-run Python snippet designed to parse a custom tabular CSV file and compute the One-Way ANOVA statistic automatically:

\`\`\`python
import pandas as pd
import scipy.stats as stats

# 1. Load the CSV dataset
df = pd.read_csv('user_performance_dataset.csv')

# Let's assume your CSV has columns: 'Group' (SaaS Plan tier) and 'Metric' (Active Hours)
print("--- Dataset Sample ---")
print(df.head())

# 2. Extract unique grouping categories
groups = df['Group'].unique()
print(f"\\nFound Groups: {groups}")

# 3. Restructure groups into lists for scipy
grouped_data = [df[df['Group'] == group]['Metric'].values for group in groups]

# 4. Run One-Way ANOVA
f_val, p_val = stats.f_oneway(*grouped_data)

print("\\n--- ANOVA Results ---")
print(f"F-Value: {f_val:.4f}")
print(f"p-Value: {p_val:.6e}")

# 5. Interpretation
alpha = 0.05
if p_val < alpha:
    print("Conclusion: Reject null hypothesis! There is a statistically significant difference.")
else:
    print("Conclusion: Fail to reject null hypothesis. Group means are statistically equivalent.")
\`\`\`

This script separates your groups using clean array comprehensions, then leverages \`scipy.stats.f_oneway\` to output standard F-values and p-values.`,

  'code-review': `### Code Review: Non-Memoized Component Calculations

Here is a feedback summary for a React component executing heavy statistical rendering calculations inside its main render loop:

#### ❌ The Bad Code:
\`\`\`tsx
import React from 'react';

// Runs heavy loops on EVERY render trigger!
export default function HeavyComponent({ rawData, filterQuery }) {
  // Heavy computation executing synchronously
  const processedItems = rawData.map(item => {
    let result = item.score;
    for (let i = 0; i < 100000; i++) {
       result = (result * 1.0001) % 1000;
    }
    return { ...item, calculatedRank: result };
  });

  const filtered = processedItems.filter(item => item.name.includes(filterQuery));

  return (
    <ul>
      {filtered.map(item => <li key={item.id}>{item.name} - Rank: {item.calculatedRank}</li>)}
    </ul>
  );
}
\`\`\`

#### 🔍 Review Feedback:
1. **Main Render Block Blockage**: The \`for\` loop of 100,000 runs is executed synchronously *every time* the parent re-renders or the user types inside \`filterQuery\`, leading to skipped frames and UI stuttering.
2. **Object Creation**: It instantiates new mapped arrays and item objects every render, breaking reference equality checks for downstream components.

#### ✅ The Optimised Code (Memoized):
\`\`\`tsx
import React, { useMemo } from 'react';

export default function HeavyComponent({ rawData, filterQuery }) {
  // 1. Memoize the expensive transformation, re-run ONLY when rawData changes
  const processedItems = useMemo(() => {
    return rawData.map(item => {
      let result = item.score;
      for (let i = 0; i < 100000; i++) {
         result = (result * 1.0001) % 1000;
      }
      return { ...item, calculatedRank: result };
    });
  }, [rawData]);

  // 2. Memoize secondary filters independently so typing in input is blazing fast
  const filtered = useMemo(() => {
    return processedItems.filter(item => 
      item.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [processedItems, filterQuery]);

  return (
    <ul>
      {filtered.map(item => (
        <li key={item.id} className="py-1 border-b border-zinc-800">
          {item.name} — <span className="font-mono text-cyan-400">Rank: {item.calculatedRank.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

By utilizing \`useMemo\`, we preserve calculations across state updates, reducing render-cycle CPU cycles to nearly zero when typing.`
};

/**
 * Generates an intelligent Qwen reply based on keywords or matches
 */
export function generateMockResponse(userInput: string): string {
  const query = userInput.toLowerCase();
  
  if (query.includes('python') || query.includes('decorator')) {
    return MOCK_QWEN_ANSWERS['explain-python'];
  }
  if (query.includes('json') || query.includes('schema')) {
    return MOCK_QWEN_ANSWERS['generate-json'];
  }
  if (query.includes('email') || query.includes('launch') || query.includes('newsletter')) {
    return MOCK_QWEN_ANSWERS['write-email'];
  }
  if (query.includes('csv') || query.includes('anova') || query.includes('pandas')) {
    return MOCK_QWEN_ANSWERS['summarize-csv'];
  }
  if (query.includes('react') || query.includes('review') || query.includes('memo')) {
    return MOCK_QWEN_ANSWERS['code-review'];
  }

  // Fallback AI conversation generator
  return `### Hello! I am My Qwen, your premium AI partner.

Thank you for reaching out. I have processed your input: *"_**${userInput}**_"*. 

As an advanced language assistant, I am engineered with:
1.  **Analytical Processing**: For reasoning and breaking down difficult requests.
2.  **Structured Code blocks**: Providing clean, production-ready examples instantly.
3.  **Aesthetic Layouts**: Adapting perfectly to your workspace requirements.

#### 💡 Suggested actions you can request next:
*   Ask me to **write a script** in Python, TypeScript, or Go.
*   Ask me to **refactor or optimize** existing front-end layout configurations.
*   Inquire about **statistical analysis** or tabular CSV operations.

Let me know if there is a specific direction you would like me to unpack!`;
}
