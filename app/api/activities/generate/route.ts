import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { Activity, ActivityCategory, CompletedActivity } from '@/lib/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      completedActivities = [],
      existingActivities = [],
      count = 5
    }: {
      completedActivities: CompletedActivity[];
      existingActivities: Activity[];
      count?: number;
    } = body;

    // Calculate preferences based on completed activities
    const preferences = calculatePreferences(completedActivities, existingActivities);

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the prompt with preference data
    const prompt = buildPrompt(preferences, existingActivities);

    // Generate activities
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const generatedActivities = parseActivities(text, count);

    return NextResponse.json({
      success: true,
      activities: generatedActivities,
      preferences
    });

  } catch (error) {
    console.error('Error generating activities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

interface ActivityPreferences {
  topCategories: { category: ActivityCategory; score: number }[];
  topActivities: { activity: Activity; completionRate: number }[];
  preferredDuration: string;
  totalCompleted: number;
}

function calculatePreferences(
  completedActivities: CompletedActivity[],
  existingActivities: Activity[]
): ActivityPreferences {
  // Count completions by category
  const categoryScores: Record<ActivityCategory, number> = {
    bonding: 0,
    fun: 0,
    learning: 0,
    health: 0,
    creative: 0,
    outdoor: 0,
  };

  // Track activity completion rates
  const activityCompletions: Record<string, number> = {};

  completedActivities.forEach(ca => {
    activityCompletions[ca.activityId] = (activityCompletions[ca.activityId] || 0) + 1;

    const activity = existingActivities.find(a => a.id === ca.activityId);
    if (activity) {
      categoryScores[activity.category]++;
    }
  });

  // Sort categories by score
  const topCategories = Object.entries(categoryScores)
    .map(([category, score]) => ({
      category: category as ActivityCategory,
      score
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Sort activities by completion count
  const topActivities = Object.entries(activityCompletions)
    .map(([activityId, count]) => {
      const activity = existingActivities.find(a => a.id === activityId);
      return {
        activity: activity!,
        completionRate: count,
      };
    })
    .filter(item => item.activity)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // Determine preferred duration (from most completed activities)
  const durations = topActivities
    .map(item => item.activity.duration)
    .filter(Boolean);
  const preferredDuration = durations[0] || '1-2 hours';

  return {
    topCategories,
    topActivities,
    preferredDuration,
    totalCompleted: completedActivities.length,
  };
}

function buildPrompt(preferences: ActivityPreferences, existingActivities: Activity[]): string {
  const { topCategories, topActivities, preferredDuration } = preferences;

  const topCategoryNames = topCategories.map(c => c.category).join(', ');
  const topActivityTitles = topActivities.map(a => a.activity.title).slice(0, 3);

  let prompt = `You are a family activity recommendation AI. Generate 5 creative, engaging family activities in JSON format.

## Context:
- User's favorite categories: ${topCategoryNames || 'No preferences yet'}
- Most completed activities: ${topActivityTitles.length > 0 ? topActivityTitles.join(', ') : 'None yet'}
- Preferred duration: ${preferredDuration}

## Requirements:
1. Create variations and similar activities based on what they enjoy
2. Focus more on their preferred categories (${topCategoryNames})
3. Each activity should be unique and not duplicate existing ones
4. Include a mix of their favorites and new ideas to try

## Existing Activities (DO NOT duplicate these exact titles):
${existingActivities.slice(0, 15).map(a => `- ${a.title}`).join('\n')}

## Output Format:
Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Activity Name",
    "description": "Detailed description (1-2 sentences)",
    "category": "bonding|fun|learning|health|creative|outdoor",
    "duration": "e.g., 30 mins, 1-2 hours",
    "tags": ["Tag1", "Tag2", "Tag3"]
  }
]

Generate 5 activities now:`;

  return prompt;
}

function parseActivities(text: string, count: number): Activity[] {
  try {
    // Extract JSON from markdown code blocks if present
    let jsonText = text.trim();

    // Remove markdown code block markers
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(jsonText);
    const activities = Array.isArray(parsed) ? parsed : [parsed];

    return activities.slice(0, count).map((activity: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      title: activity.title,
      description: activity.description,
      category: activity.category as ActivityCategory,
      duration: activity.duration,
      tags: activity.tags || [],
      aiGenerated: true,
    }));
  } catch (error) {
    console.error('Failed to parse activities:', error);
    console.error('Raw text:', text);

    // Return fallback activities
    return generateFallbackActivities(count);
  }
}

function generateFallbackActivities(count: number): Activity[] {
  const fallbacks: Omit<Activity, 'id'>[] = [
    {
      title: 'Family Storytelling Circle',
      description: 'Take turns sharing stories from your lives, childhood memories, or make up creative tales together.',
      category: 'bonding',
      duration: '30-45 mins',
      tags: ['Indoor', 'Connection', 'Memories'],
      aiGenerated: true,
    },
    {
      title: 'Home Talent Show',
      description: 'Each family member prepares a short performance - sing, dance, magic trick, or comedy routine!',
      category: 'fun',
      duration: '1-2 hours',
      tags: ['Indoor', 'Creative', 'Entertainment'],
      aiGenerated: true,
    },
    {
      title: 'Nature Scavenger Hunt',
      description: 'Create a list of items to find outdoors (leaf shapes, animal tracks, flowers) and explore together.',
      category: 'outdoor',
      duration: '1 hour',
      tags: ['Outdoor', 'Adventure', 'Learning'],
      aiGenerated: true,
    },
    {
      title: 'Cooking Challenge',
      description: 'Choose a recipe and have a friendly cooking competition or work together to create a new dish.',
      category: 'creative',
      duration: '2 hours',
      tags: ['Indoor', 'Food', 'Teamwork'],
      aiGenerated: true,
    },
    {
      title: 'Family Fitness Circuit',
      description: 'Design a fun workout with stations (jumping jacks, planks, dance moves) and complete it together.',
      category: 'health',
      duration: '30 mins',
      tags: ['Indoor/Outdoor', 'Active', 'Wellness'],
      aiGenerated: true,
    },
  ];

  return fallbacks.slice(0, count).map((activity, index) => ({
    ...activity,
    id: `fallback-${Date.now()}-${index}`,
  }));
}
