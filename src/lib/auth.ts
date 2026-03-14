import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET } from 'astro:env/server';
import { timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { logger } from './logger';

const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/** Cached CryptoKey — one importKey per cold start */
let cachedKey: CryptoKey | null = null;

async function getSigningKey(): Promise<CryptoKey> {
	if (cachedKey) return cachedKey;

	const encoder = new TextEncoder();
	cachedKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(SESSION_SECRET),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
	return cachedKey;
}

/**
 * Sign data with HMAC-SHA256, returning a hex-encoded signature
 */
async function signData(data: string): Promise<string> {
	const key = await getSigningKey();
	const encoder = new TextEncoder();
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Timing-safe string comparison
 */
function safeCompare(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	const encoder = new TextEncoder();
	return timingSafeEqual(encoder.encode(a), encoder.encode(b));
}

async function createSessionToken(email: string): Promise<string> {
	const payload = JSON.stringify({
		email,
		createdAt: Date.now(),
	});
	const signature = await signData(payload);
	return `${btoa(payload)}.${signature}`;
}

async function verifySessionToken(token: string): Promise<string | null> {
	try {
		const [payloadBase64, signature] = token.split('.');
		if (!payloadBase64 || !signature) return null;

		const payload = atob(payloadBase64);
		const expectedSignature = await signData(payload);

		if (!safeCompare(signature, expectedSignature)) return null;

		const data = JSON.parse(payload);
		const age = Date.now() - data.createdAt;

		// Check if token is expired
		if (age > SESSION_MAX_AGE * 1000) return null;

		return data.email;
	} catch {
		return null;
	}
}

/**
 * Verify login credentials using timing-safe comparison
 */
export function verifyCredentials(email: string, password: string): boolean {
	const encoder = new TextEncoder();
	const emailBytes = encoder.encode(email);
	const expectedEmailBytes = encoder.encode(ADMIN_EMAIL);
	const passwordBytes = encoder.encode(password);
	const expectedPasswordBytes = encoder.encode(ADMIN_PASSWORD);

	// Both comparisons must succeed; use bitwise AND to avoid short-circuit
	const emailMatch =
		emailBytes.length === expectedEmailBytes.length &&
		timingSafeEqual(emailBytes, expectedEmailBytes);
	const passwordMatch =
		passwordBytes.length === expectedPasswordBytes.length &&
		timingSafeEqual(passwordBytes, expectedPasswordBytes);

	return emailMatch && passwordMatch;
}

/**
 * Create a session for the authenticated user
 */
export async function createSession(cookies: AstroCookies, email: string): Promise<void> {
	const token = await createSessionToken(email);
	logger.debug('Creating session cookie');
	cookies.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: SESSION_MAX_AGE,
		path: '/',
	});
	logger.debug('Session cookie set');
}

/**
 * Get the current user from session
 */
export async function getSessionUser(cookies: AstroCookies): Promise<string | null> {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!token) {
		logger.debug('No session cookie found');
		return null;
	}
	const email = await verifySessionToken(token);
	logger.debug('Session verification complete', { authenticated: !!email });
	return email;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
	return (await getSessionUser(cookies)) !== null;
}

/**
 * Destroy the current session
 */
export function destroySession(cookies: AstroCookies): void {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
