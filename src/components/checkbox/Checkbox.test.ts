import { fireEvent, render, screen } from '@testing-library/svelte'
import Checkbox from './Checkbox.svelte'

describe('Switch Component', () => {
	it('should render the component', () => {
		render(Checkbox)

		const node = screen.getByTestId('checkbox')
		expect(node).toBeTruthy()
	})

	it('should initialy not be checked', () => {
		render(Checkbox)

		const node = screen.getByTestId('checkbox')
		const checkbox = node.querySelector<HTMLInputElement>('input[type="checkbox"]')
		expect(checkbox?.checked).toBe(false)
	})

	it('should check the component', () => {
		render(Checkbox)

		const node = screen.getByTestId('checkbox')
		const checkbox = node.querySelector<HTMLInputElement>('input[type="checkbox"]')
		expect(checkbox?.checked).toBe(false)

		if (!checkbox) return

		fireEvent.click(checkbox)

		expect(checkbox?.checked).toBe(true)
	})
})
