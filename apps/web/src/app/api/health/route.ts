import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    service: 'LionSpace Intelligence Platform',
    version: '1.0.0',
    uptime: process.uptime(),
  });
}