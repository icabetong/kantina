export function getCurrencyFormatter() {
	return Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
}
