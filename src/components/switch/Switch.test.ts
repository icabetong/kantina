import { fireEvent, render, screen } from '@testing-library/svelte'
import Switch from './Switch.svelte'

describe('Switch Component', () => {
	it('should render the component', () => {
		render(Switch)

		const node = screen.getByTestId('switch')
		expect(node).toBeTruthy()
	})

	it('should initialy not be checked', () => {
		render(Switch)

		const node = screen.getByTestId('switch')
		const checkbox = node.querySelector<HTMLInputElement>('input[type="checkbox"]')
		expect(checkbox?.checked).toBe(false)
	})

	it('should check the component', () => {
		render(Switch)

		const node = screen.getByTestId('switch')
		const label = node.querySelector('label')
		const checkbox = node.querySelector<HTMLInputElement>('input[type="checkbox"]')
		expect(checkbox?.checked).toBe(false)

		if (!label) return

		fireEvent.click(label)

		expect(checkbox?.checked).toBe(true)
	})
})
