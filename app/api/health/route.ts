import { NextResponse } from 'next/server';

interface HealthCheck {
  status: 'operational' | 'degraded' | 'down';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    database: boolean;
    redis: boolean;
    filesystem: boolean;
  };
}

export async function GET(): Promise<NextResponse<HealthCheck>> {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    filesystem: await checkFilesystem()
  };

  const allHealthy = Object.values(checks).every(check => check);
  const status = allHealthy ? 'operational' : 'degraded';

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    service: 'LionSpace Enterprise Platform',
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    checks
  });
}

async function checkDatabase(): Promise<boolean> {
  try {
    // בדיקה פשוטה שהמשתנה קיים
    return !!process.env.DATABASE_URL;
  } catch {
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    // בדיקה פשוטה שהמשתנה קיים
    return !!process.env.REDIS_URL;
  } catch {
    return false;
  }
}

async function checkFilesystem(): Promise<boolean> {
  try {
    // בדיקה שיש גישה לקבצים
    const fs = await import('fs/promises');
    await fs.access('./package.json');
    return true;
  } catch {
    return false;
  }
}