import Button from './Button.svelte'
import { render, screen } from '@testing-library/svelte'

describe('Button Component', () => {
	it('should render the component', () => {
		render(Button)

		const node = screen.getByTestId('button')
		expect(node).toBeTruthy()
	})
})
