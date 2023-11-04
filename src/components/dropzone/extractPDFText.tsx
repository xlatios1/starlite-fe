// https://www.codewithsundeep.com/2023/03/extract-pdf-text-javascript.html
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const ExtractTextFromFile = async (file) => {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader()
			reader.readAsDataURL(file)

			reader.onload = async () => {
				let alltext = []
				let pdf = await pdfjsLib.getDocument(reader.result).promise

				for (let i = 1; i <= pdf.numPages; i++) {
					let page = await pdf.getPage(i)
					let txt = await page.getTextContent()
					let matchingText = txt.items.map((item) => item.str)
					alltext.push(matchingText)
				}
				const extractedText = Array.from(
					new Set(alltext.join(' ').match(/[a-zA-Z]{2}[0-9]{4}/g))
				)
				resolve(extractedText)
			}
		} catch (error) {
			reject(error)
		}
	})
}
