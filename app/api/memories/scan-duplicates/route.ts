import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { Photo } from '@/lib/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photos }: { photos: Photo[] } = body;

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No photos provided' },
        { status: 400 }
      );
    }

    // Group duplicates
    const duplicateGroups = await findDuplicates(photos);

    return NextResponse.json({
      success: true,
      duplicateGroups,
      totalDuplicates: duplicateGroups.reduce((sum, group) => sum + group.duplicates.length, 0),
    });

  } catch (error) {
    console.error('Error scanning for duplicates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scan for duplicates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

interface DuplicateGroup {
  original: Photo;
  duplicates: Array<{
    photo: Photo;
    similarityScore: number;
    reason: string;
  }>;
}

async function findDuplicates(photos: Photo[]): Promise<DuplicateGroup[]> {
  const duplicateGroups: DuplicateGroup[] = [];
  const processedPhotoIds = new Set<string>();

  // Strategy 1: Exact match detection (same base64 data)
  for (let i = 0; i < photos.length; i++) {
    if (processedPhotoIds.has(photos[i].id)) continue;

    const original = photos[i];
    const exactDuplicates: Array<{ photo: Photo; similarityScore: number; reason: string }> = [];

    for (let j = i + 1; j < photos.length; j++) {
      if (processedPhotoIds.has(photos[j].id)) continue;

      const candidate = photos[j];

      // Check for exact match
      if (original.url === candidate.url) {
        exactDuplicates.push({
          photo: candidate,
          similarityScore: 100,
          reason: 'Exact duplicate (identical file)',
        });
        processedPhotoIds.add(candidate.id);
      }
    }

    if (exactDuplicates.length > 0) {
      duplicateGroups.push({
        original,
        duplicates: exactDuplicates,
      });
      processedPhotoIds.add(original.id);
    }
  }

  // Strategy 2: AI-powered visual similarity detection
  // Only run if we have API key and remaining photos to check
  if (process.env.GEMINI_API_KEY && photos.length - processedPhotoIds.size > 1) {
    const remainingPhotos = photos.filter(p => !processedPhotoIds.has(p.id));

    // For performance, only compare if we have a reasonable number of photos
    if (remainingPhotos.length <= 20) {
      const aiDuplicates = await findVisualDuplicatesWithAI(remainingPhotos);
      duplicateGroups.push(...aiDuplicates);
    }
  }

  return duplicateGroups;
}

async function findVisualDuplicatesWithAI(photos: Photo[]): Promise<DuplicateGroup[]> {
  const duplicateGroups: DuplicateGroup[] = [];

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Compare photos in batches to avoid overwhelming the API
    for (let i = 0; i < photos.length; i++) {
      const original = photos[i];
      const duplicates: Array<{ photo: Photo; similarityScore: number; reason: string }> = [];

      // Compare with remaining photos
      for (let j = i + 1; j < photos.length; j++) {
        const candidate = photos[j];

        try {
          // Prepare images for Gemini
          const imageData1 = extractBase64Data(original.url);
          const imageData2 = extractBase64Data(candidate.url);

          if (!imageData1 || !imageData2) continue;

          const prompt = `Analyze these two images and determine if they are duplicates or very similar photos.

Consider them duplicates if:
- They are the EXACT same photo (100% match)
- They are from the same burst/series (same moment, slightly different timing)
- They show the same scene/subject from nearly identical angles
- They have minor differences like cropping, filters, or lighting adjustments

Rate similarity 0-100:
- 100: Exact duplicate or burst photo from same second
- 80-99: Same scene/subject, very similar composition
- 60-79: Same scene but different angle/timing
- Below 60: Different photos

Respond ONLY with valid JSON:
{
  "isDuplicate": true,
  "similarityScore": 95,
  "reason": "Same photo from burst series"
}`;

          const result = await model.generateContent([
            { text: prompt },
            {
              inlineData: {
                mimeType: getMimeType(original.url),
                data: imageData1,
              },
            },
            {
              inlineData: {
                mimeType: getMimeType(candidate.url),
                data: imageData2,
              },
            },
          ]);

          const response = await result.response;
          const text = response.text();

          // Parse JSON response - try multiple parsing strategies
          let analysis = null;

          // Strategy 1: Find JSON object
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              analysis = JSON.parse(jsonMatch[0]);
            } catch (e) {
              console.error('Failed to parse JSON:', jsonMatch[0]);
            }
          }

          // Strategy 2: Try parsing entire text (in case it's already clean JSON)
          if (!analysis) {
            try {
              analysis = JSON.parse(text.trim());
            } catch (e) {
              // Not valid JSON
            }
          }

          if (analysis && analysis.isDuplicate && analysis.similarityScore >= 70) {
            duplicates.push({
              photo: candidate,
              similarityScore: analysis.similarityScore,
              reason: analysis.reason || 'Visually similar photos',
            });
          }
        } catch (error) {
          console.error(`Error comparing photos ${original.id} and ${candidate.id}:`, error);
          // Continue with other comparisons
        }
      }

      if (duplicates.length > 0) {
        duplicateGroups.push({
          original,
          duplicates,
        });
      }
    }
  } catch (error) {
    console.error('Error in AI visual duplicate detection:', error);
    // Return empty groups if AI fails - exact duplicates were already found
  }

  return duplicateGroups;
}

function extractBase64Data(dataUrl: string): string | null {
  try {
    // Extract base64 data from data URL
    // Format: data:image/png;base64,iVBORw0KGg...
    const matches = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}

function getMimeType(dataUrl: string): string {
  try {
    const matches = dataUrl.match(/^data:(image\/\w+);base64,/);
    return matches ? matches[1] : 'image/jpeg';
  } catch {
    return 'image/jpeg';
  }
}
