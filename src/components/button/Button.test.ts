import { render, screen } from '@testing-library/svelte'
import Button from './Button.svelte'

describe('Button Component', () => {
	it('should render the component', () => {
		render(Button)

		const node = screen.getByTestId('button')
		expect(node).toBeTruthy()
	})
})
