import PocketBase from 'pocketbase'
import { PUBLIC_API_ENDPOINT } from '$env/static/public'

const pocketbase = new PocketBase(PUBLIC_API_ENDPOINT)
export default pocketbase
