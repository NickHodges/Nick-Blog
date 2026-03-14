import { ADMIN_EMAIL, ADMIN_PASSWORD } from 'astro:env/server';
import { timingSafeEqual } from 'node:crypto';

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
