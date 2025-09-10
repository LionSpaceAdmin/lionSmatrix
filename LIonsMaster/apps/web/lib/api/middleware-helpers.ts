import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const now = Date.now();
  
  // Clean up old entries
  cleanupOldEntries();
  const userLimit = rateLimit.get(ip);
  
  if (!userLimit || userLimit.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return NextResponse.next();
  }
  
  if (userLimit.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(MAX_REQUESTS),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
        }
      }
    );
  }
  
  userLimit.count++;
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(MAX_REQUESTS - userLimit.count));
  response.headers.set('X-RateLimit-Reset', new Date(userLimit.resetTime).toISOString());
  
  return response;
}

// Clean up old entries on each request (Edge Runtime doesn't support setInterval)
function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, limit] of rateLimit.entries()) {
    if (limit.resetTime < now) {
      rateLimit.delete(ip);
    }
  }
}
