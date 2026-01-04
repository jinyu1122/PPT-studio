import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { prompt: unknown; page: unknown };
    const { prompt, page } = body;
    console.log(prompt);
    // Validate input
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    if (typeof page !== 'number') {
      return NextResponse.json(
        { error: 'Invalid page number' },
        { status: 400 }
      );
    }

    // Log the request for now
    console.log('Generate request:', { prompt, page });

    // TODO: Add your AI generation logic here
    // page === -1 means global update
    // page >= 0 means single page update

    // Return a success response
    return NextResponse.json({
      success: true,
      message: page === -1 
        ? 'Global generation request received' 
        : `Single page generation request received for page ${page + 1}`,
      data: {
        prompt,
        page
      }
    });
  } catch (error) {
    console.error('Error processing generate request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
