export const handleEmailChanges = (input: string) => {
	const splitInput = input.split('@', 2)
	const domain = '@e.ntu.edu.sg'
	let newLetters = ''

	try {
		if (splitInput.length === 2) {
			if (splitInput[1].length > 12) {
				for (let i = 0, c = 0; i < splitInput[1].length && c < 13; i++) {
					if (splitInput[1][i] === domain.substring(1)[c]) {
						c++
					} else {
						newLetters += splitInput[1][i]
					}
				}
			} else if (splitInput[1].length < 13) {
				splitInput[0] = splitInput[0].substring(
					0,
					splitInput[0].length - (12 - splitInput[1].length)
				)
			}
			return (splitInput[0] + newLetters + domain).replace(' ', '')
		} else if (splitInput.length === 1) {
			if (input.length === 0) {
				return domain
			} else {
				return splitInput[0] + domain
			}
		} else {
			return 'You unlocked easter egg!'
		}
	} catch (e) {
		return e.message
	}
}
