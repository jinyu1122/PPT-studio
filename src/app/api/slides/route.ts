import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const slidesDir = path.join(process.cwd(), 'public', 'slides');
    
    // 确保slides目录存在
    if (!fs.existsSync(slidesDir)) {
      fs.mkdirSync(slidesDir, { recursive: true });
    }
    
    // 读取所有slide文件
    const files = fs.readdirSync(slidesDir)
      .filter(file => file.endsWith('.html'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide-(\d+)\.html/)?.[1] || '0');
        const numB = parseInt(b.match(/slide-(\d+)\.html/)?.[1] || '0');
        return numA - numB;
      });
    
    const slides = files.map(file => {
      const content = fs.readFileSync(path.join(slidesDir, file), 'utf-8');
      const slideNumber = parseInt(file.match(/slide-(\d+)\.html/)?.[1] || '0');
      return {
        id: slideNumber,
        filename: file,
        content: content
      };
    });
    
    return NextResponse.json({ slides, total: slides.length });
  } catch (error) {
    console.error('Error reading slides:', error);
    return NextResponse.json({ error: 'Failed to load slides' }, { status: 500 });
  }
}