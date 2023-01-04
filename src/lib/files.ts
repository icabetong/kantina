import pocketbase from './backend'

/**
 * @description
 * This concatinates the information required to build the URL used
 * to fetch the file stored in the backend.
 *
 * @param collection The collection or table name where the image is referenced
 * @param id The id of the row where the image is referenced
 * @param fileName The filename of the file
 * @param size Optional size options to specify the thumbnail size
 * @returns the URL of the file where it can be used to download
 */
export function parseFileUrl(
	collection: string,
	id: string,
	fileName: string,
	size?: string
): string {
	// example url:
	// http://127.0.0.1:8090/api/files/example/kfzjt5oy8r34hvn/test_52iWbGinWd.png

	let url = `${pocketbase.baseUrl}/api/files/${collection}/${id}/${fileName}`
	if (size) url = url.concat(`?thumb=${size}`)

	return url
}
