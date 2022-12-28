// these needs to be hardcoded so that Tailwind
// will not purge these classes on build

export const colors = [
	'yellow',
	'lime',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'rose'
]

export function getColor100(color: string): string {
	switch (color) {
		case 'yellow':
			return 'bg-yellow-100'
		case 'lime':
			return 'bg-lime-100'
		case 'emerald':
			return 'bg-emerald-100'
		case 'teal':
			return 'bg-teal-100'
		case 'cyan':
			return 'bg-cyan-100'
		case 'sky':
			return 'bg-sky-100'
		case 'indigo':
			return 'bg-indigo-100'
		case 'violet':
			return 'bg-violet-100'
		case 'purple':
			return 'bg-purple-100'
		case 'fuchsia':
			return 'bg-fuchsia-100'
		case 'rose':
			return 'bg-rose-100'
		default:
			return 'bg-yellow-100'
	}
}

export function getColor500(color: string): string {
	switch (color) {
		case 'yellow':
			return 'bg-yellow-500'
		case 'lime':
			return 'bg-lime-500'
		case 'emerald':
			return 'bg-emerald-500'
		case 'teal':
			return 'bg-teal-500'
		case 'cyan':
			return 'bg-cyan-500'
		case 'sky':
			return 'bg-sky-500'
		case 'indigo':
			return 'bg-indigo-500'
		case 'violet':
			return 'bg-violet-500'
		case 'purple':
			return 'bg-purple-500'
		case 'fuchsia':
			return 'bg-fuchsia-500'
		case 'rose':
			return 'bg-rose-500'
		default:
			return 'bg-yellow-500'
	}
}

export function getTextColor800(color: string): string {
	switch (color) {
		case 'yellow':
			return 'text-yellow-800'
		case 'lime':
			return 'text-lime-800'
		case 'emerald':
			return 'text-emerald-800'
		case 'teal':
			return 'text-teal-800'
		case 'cyan':
			return 'text-cyan-800'
		case 'sky':
			return 'text-sky-800'
		case 'indigo':
			return 'text-indigo-800'
		case 'violet':
			return 'text-violet-800'
		case 'purple':
			return 'text-purple-800'
		case 'fuchsia':
			return 'text-fuchsia-800'
		case 'rose':
			return 'text-rose-800'
		default:
			return 'text-yellow-800'
	}
}
