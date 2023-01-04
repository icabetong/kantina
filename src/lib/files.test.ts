import { parseFileUrl } from './files'

vi.mock('$env/static/public', () => ({ PUBLIC_API_ENDPOINT: 'https://kantina.com' }))

describe('Files', () => {
	it('should correctly build an URL', () => {
		const url = parseFileUrl('images', 'foo', 'bar.png')

		expect(url).toEqual('https://kantina.com/api/files/images/foo/bar.png')
	})

	it('should build a URL with thumbnail options', () => {
		const url = parseFileUrl('images', 'foo', 'bar.png', '500x500')

		expect(url).toEqual('https://kantina.com/api/files/images/foo/bar.png?thumb=500x500')
	})
})
