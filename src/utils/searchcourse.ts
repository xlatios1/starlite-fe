type ntuapi = {
	academic_units: number
	code: string
	id: number
	name: string
}
export default async function SearchCourse(
	hint,
	search: string
): Promise<ntuapi[]> {
	const text_without_punctuation: string = search.replace(
		/[.,/#!$%^&*;:{@+|}=\-_`~()]/g,
		''
	)

	const valid_course: ntuapi[] = []
	const courseRegex: RegExp = /\b\w{6}\b/g
	let match

	while ((match = courseRegex.exec(text_without_punctuation)) !== null) {
		const course: string = match[0]
		if (valid_course.filter((c) => c.code === match[0]).length === 0) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_COURSE_CODE_API}${course}`
				)
				if (!response.ok) {
					throw new Error('Network response was not ok.')
				}
				const results = await response.json().then((r) => r.results as ntuapi[])
				if (results.length > 0) {
					valid_course.push(results[0])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
				return null
			}
		}
	}
	return valid_course
}
