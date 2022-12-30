export function getCurrencyFormatter(withDecimal = true): Intl.NumberFormat {
	return Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		maximumFractionDigits: withDecimal ? undefined : 0,
		minimumFractionDigits: withDecimal ? undefined : 0
	})
}

export function getDateTimeFormatter(): Intl.DateTimeFormat {
	return Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}
