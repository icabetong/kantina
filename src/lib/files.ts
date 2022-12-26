import pocketbase from './backend'

export function parseFileUrl(collection: string, id: string, fileName: string, size?: string) {
	// example url:
	// http://127.0.0.1:8090/api/files/example/kfzjt5oy8r34hvn/test_52iWbGinWd.png

	let url = `${pocketbase.baseUrl}/api/files/${collection}/${id}/${fileName}`
	if (size) url = url.concat(`?thumb=${size}`)

	return url
}
