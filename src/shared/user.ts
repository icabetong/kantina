/**
 * @description
 * Takes an User object and
 * and returns a concatinated string of the first and last names
 *
 * @param user The User object containing the first and last names.
 *
 * @returns The concatinated full name of the user.
 */
export function getFullName(user: User): string {
	return `${user.firstName} ${user.lastName}`
}

export function capitalize(source: string): string {
	return source.charAt(0).toUpperCase() + source.slice(1)
}
