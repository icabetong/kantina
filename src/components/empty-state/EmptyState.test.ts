import EmptyState from './EmptyState.svelte'
import { render, screen } from '@testing-library/svelte'

describe('Button Component', () => {
	it('should render the component', () => {
		render(EmptyState, {
			props: {
				title: 'Foo',
				message: 'Lorem Ipsum'
			}
		})

		const node = screen.getByTestId('button')
		expect(node).toBeTruthy()
	})
})
