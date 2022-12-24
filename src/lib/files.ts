import pocketbase from './backend'
import type { FileQueryParams, Record } from 'pocketbase'

export const buildFileUrl = (
	record: Record,
	fileName: string,
	queryParams?: FileQueryParams
): string => {
	return pocketbase.getFileUrl(record, fileName, queryParams)
}
