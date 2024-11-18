// utils/helperFunctions.ts

export const formatPhoneNumber = (phone: string): string => {
	const cleaned = phone.replace(/\D/g, '').replace(/^1/, '');

	if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	}

	// Return the original string if it doesn't match the expected format
	return phone;
};