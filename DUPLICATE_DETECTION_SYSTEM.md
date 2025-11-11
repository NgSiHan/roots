# AI-Powered Duplicate Photo Detection System

This system uses AI to detect and manage duplicate photos in your memories, with a 30-day recovery period for accidental discards.

## Features

### 🔍 **Smart Duplicate Detection**
- **Exact Match Detection**: Identifies photos with identical file data
- **AI Visual Similarity**: Uses Gemini Vision API to detect visually similar photos
- **Similarity Scoring**: Rates duplicates from 0-100% similarity
- **Batch Processing**: Scans all photos across all albums efficiently

### 🗑️ **Safe Discard System**
- **30-Day Recovery**: Discarded photos kept for 30 days before permanent deletion
- **Auto-Cleanup**: Expired photos automatically removed after 30 days
- **Source Tracking**: Remember which album/memory photos came from
- **Bulk Operations**: Recover or delete multiple photos at once

### 📊 **Review Interface**
- **Side-by-Side Comparison**: View original vs. duplicate
- **Selective Discard**: Choose which duplicates to keep/discard
- **Visual Feedback**: Color-coded similarity scores
- **Detailed Metadata**: See why photos were flagged as duplicates

---

## How It Works

### Detection Process

1. **Trigger Scan**
   - Click "🔍 Scan for Duplicates" button on Memories page
   - System collects all photos from all albums
   - Requires at least 2 photos to scan

2. **Two-Phase Detection**

   **Phase 1: Exact Match Detection**
   - Compares base64 data of all photos
   - Instant detection (no API calls)
   - 100% accuracy for identical files
   - Groups exact duplicates together

   **Phase 2: AI Visual Similarity** (if applicable)
   - Uses Gemini Vision API (gemini-2.0-flash-exp)
   - Analyzes image content, not just file data
   - Detects:
     - Burst photos (same moment, slight differences)
     - Similar compositions
     - Same scene with minor variations
   - Only compares if <= 20 photos to scan (performance limit)
   - Similarity threshold: 80% minimum

3. **Results Display**
   - Shows groups of duplicates
   - Each group has 1 original (green border) + duplicates
   - Displays similarity scores and reasons
   - Select which duplicates to discard

### Discard & Recovery Flow

```
User scans → Reviews duplicates → Selects to discard
                                        ↓
                              Photos moved to Discard Bin
                                        ↓
                              30-day recovery period
                                        ↓
                          [User can recover OR delete]
                                        ↓
                          After 30 days: Auto-deleted
```

---

## User Guide

### Scanning for Duplicates

1. Navigate to **Memories** page
2. Click **"🔍 Scan for Duplicates"** button (top right)
3. Wait for scan to complete (progress indicator shown)
4. Review results in modal

### Reviewing Duplicates

**Duplicate Review Modal:**
- **Original Photo** (green border, keep): The photo system keeps
- **Duplicate Photos**: Potential duplicates with similarity %
- **Select/Deselect**: Click checkbox or card to toggle
- **Select All**: Quick select all duplicates
- **Clear Selection**: Deselect all

**Actions:**
- **Cancel**: Close modal without changes
- **Discard X Photos**: Move selected photos to discard bin (30-day recovery)

### Managing Discarded Photos

**Access Discarded Page:**
- Navigate to `/discarded` or use the navigation link
- See all discarded photos grouped by urgency

**Photo Groups:**
- **Expiring Soon** (< 7 days left): Red badge
- **Recently Discarded** (7-14 days left): Orange badge
- **Safe** (> 14 days left): Green badge

**Actions:**
- **Recover Photo**: Restore to original album/memory
- **Delete Permanently**: Cannot be undone
- **Bulk Select**: Use checkboxes for multiple photos
- **Lightbox View**: Click photo for detailed view

### Auto-Cleanup

- **Automatic**: Runs on page mount
- **30-Day Expiry**: Photos deleted after expiration date
- **Silent**: No user action required
- **Safe**: Only deletes expired photos

---

## Technical Details

### Data Structure

```typescript
interface DiscardedPhoto {
  photo: Photo;                  // Original photo data (base64)
  discardedAt: string;           // ISO date when discarded
  expiresAt: string;             // ISO date (30 days from discard)
  reason: 'duplicate' | 'manual'; // Why it was discarded
  duplicateOf?: string;          // Photo ID this is duplicate of
  similarityScore?: number;      // 0-100 similarity rating
  sourceAlbumId: string;         // Which album it came from
  sourceMemoryId: string;        // Which memory it came from
  sourceMemoryTitle: string;     // Memory title for context
}
```

### API Endpoint

**Route:** `POST /api/memories/scan-duplicates`

**Request Body:**
```json
{
  "photos": [
    {
      "id": "photo-123",
      "url": "data:image/jpeg;base64,...",
      "caption": "Beach Day",
      "color": "#E8C4D4"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "duplicateGroups": [
    {
      "original": { /* Photo object */ },
      "duplicates": [
        {
          "photo": { /* Photo object */ },
          "similarityScore": 95,
          "reason": "Visually similar photos"
        }
      ]
    }
  ],
  "totalDuplicates": 3
}
```

### Detection Algorithm

1. **Exact Match**:
   ```typescript
   if (photo1.url === photo2.url) {
     return { isDuplicate: true, similarityScore: 100 };
   }
   ```

2. **AI Visual Similarity**:
   ```typescript
   const prompt = `Compare these two images and determine if they are duplicates...`;
   const result = await geminiVision.generateContent([
     prompt,
     image1,
     image2
   ]);
   // Returns JSON with isDuplicate, similarityScore, reason
   ```

### Performance Considerations

- **Exact Match**: O(n²) but fast (no API calls)
- **AI Detection**: Limited to <= 20 photos (prevents API overuse)
- **Batch Processing**: Processes all photos in single API request
- **Caching**: Base64 extraction cached in memory

---

## Configuration

### Adjust Similarity Threshold

In [app/api/memories/scan-duplicates/route.ts:152](app/api/memories/scan-duplicates/route.ts#L152):

```typescript
// Change threshold from 80 to any value (0-100)
if (analysis.isDuplicate && analysis.similarityScore >= 80) {
  duplicates.push({ ... });
}
```

### Change Recovery Period

In [app/memories/page.tsx:118](app/memories/page.tsx#L118):

```typescript
// Change 30 days to any duration (in milliseconds)
const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
```

### Limit Photos for AI Scan

In [app/api/memories/scan-duplicates/route.ts:56](app/api/memories/scan-duplicates/route.ts#L56):

```typescript
// Change 20 to any number (higher = more API costs)
if (remainingPhotos.length <= 20) {
  const aiDuplicates = await findVisualDuplicatesWithAI(remainingPhotos);
}
```

---

## Troubleshooting

### No Duplicates Found

**Issue**: Scan completes but shows "No duplicates found"

**Causes:**
1. Photos are genuinely unique
2. Similarity threshold too high (AI didn't match)
3. AI scan skipped (>20 photos)

**Solution:**
- Try uploading known duplicates to test
- Lower similarity threshold in config
- Manually check if photos look similar

### Scan Fails

**Issue**: Error message: "Failed to scan for duplicates"

**Causes:**
1. API key missing/invalid
2. Network error
3. Invalid photo data

**Solution:**
1. Check `.env.local` has `GEMINI_API_KEY`
2. Verify internet connection
3. Check browser console for errors (F12)

### Recovery Not Working

**Issue**: Recovered photo doesn't appear in album

**Causes:**
1. Source album/memory was deleted
2. State not persisting (localStorage issues)

**Solution:**
1. Check if album still exists
2. Refresh page after recovery
3. Clear browser cache if needed

### Photos Auto-Deleted Too Soon

**Issue**: Photos deleted before 30 days

**Causes:**
1. `expiresAt` date set incorrectly
2. Auto-cleanup running incorrectly

**Solution:**
1. Check `expiresAt` calculation in code
2. Verify date is 30 days from `discardedAt`
3. Check browser console for errors

---

## File Structure

```
app/
├── api/
│   └── memories/
│       └── scan-duplicates/
│           └── route.ts              # Duplicate detection API
├── memories/
│   └── page.tsx                      # Memories page with scan button
├── discarded/
│   └── page.tsx                      # Discarded photos management page
lib/
└── types.ts                          # DiscardedPhoto interface
```

---

## Security & Privacy

✅ **Client-Side Only**: Photos stored in browser localStorage (not uploaded to server)
✅ **API-Side Processing**: Only base64 data sent to Gemini API for analysis
✅ **No Permanent Storage**: Discarded photos auto-deleted after 30 days
✅ **User Control**: Manual review required before discarding
⚠️ **API Key Required**: Gemini API key needed for visual similarity detection

---

## API Costs

### Gemini API Usage

- **Exact Match Detection**: FREE (no API calls)
- **AI Visual Similarity**: ~$0.000125 per comparison (as of 2024)
- **Example**: Scanning 20 photos = ~$2.50 (20×19/2 = 190 comparisons)

**Cost Optimization:**
1. Exact matches found first (free)
2. Only remaining photos sent to AI
3. Limited to <= 20 photos (prevents large costs)
4. User manually triggers scan (no auto-scan)

---

## Future Enhancements

Potential improvements:
- 📸 **Manual Discard**: Discard any photo manually (not just duplicates)
- 🔄 **Background Sync**: Sync discarded photos across devices
- 📊 **Stats Dashboard**: Show duplicate trends over time
- 🎯 **Smart Suggestions**: "You might want to discard..." prompts
- ⚡ **Incremental Scan**: Only scan new photos since last scan
- 🏷️ **Tag Duplicates**: Tag instead of discard for later review
- 📅 **Custom Recovery Period**: Let users choose 7/14/30/60 days

---

## Support

If you encounter issues:

1. Check this documentation
2. Review browser console for errors (F12)
3. Verify API key is correct
4. Check [Gemini AI Studio](https://aistudio.google.com/) for API status
5. Test with known duplicate photos

---

**Implementation Files:**
- API Route: [app/api/memories/scan-duplicates/route.ts](app/api/memories/scan-duplicates/route.ts)
- Memories Page: [app/memories/page.tsx](app/memories/page.tsx)
- Discarded Page: [app/discarded/page.tsx](app/discarded/page.tsx)
- Types: [lib/types.ts](lib/types.ts)

**Enjoy a clutter-free photo collection! 📸✨**
