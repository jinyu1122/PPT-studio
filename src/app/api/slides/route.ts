import { NextRequest, NextResponse } from 'next/server';

// Define the slide files statically since we can't use fs in edge runtime
const SLIDE_FILES = [
  'slide-1.html',
  'slide-2.html',
  'slide-3.html',
  'slide-4.html',
  'slide-5.html',
  'slide-6.html',
  'slide-7.html',
  'slide-8.html',
  'slide-9.html',
  'slide-10.html',
];

export async function GET(request: NextRequest) {
  try {
    // Get the base URL from the request
    const baseUrl = new URL(request.url).origin;
    
    // Fetch all slides content in parallel
    const slidePromises = SLIDE_FILES.map(async (file) => {
      const slideNumber = parseInt(file.match(/slide-(\d+)\.html/)?.[1] || '0');
      try {
        const response = await fetch(`${baseUrl}/slides/${file}`);
        if (!response.ok) {
          return null;
        }
        const content = await response.text();
        return {
          id: slideNumber,
          filename: file,
          content: content
        };
      } catch {
        return null;
      }
    });
    
    const results = await Promise.all(slidePromises);
    const slides = results.filter((slide): slide is NonNullable<typeof slide> => slide !== null);
    
    return NextResponse.json({ slides, total: slides.length });
  } catch (error) {
    console.error('Error reading slides:', error);
    return NextResponse.json({ error: 'Failed to load slides' }, { status: 500 });
  }
}

// Enable edge runtime for Cloudflare Workers compatibility
export const runtime = 'edge';