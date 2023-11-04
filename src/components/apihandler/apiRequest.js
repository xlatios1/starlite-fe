const apiRequest = async (
	api_url,
	bodyParam = null,
	err_msg = 'Error while making the request'
) => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bodyParam),
	}
	try {
		const response = await fetch(api_url, requestOptions)
		const data = await response.json()
		return [response.ok, data]
	} catch (error) {
		return [err_msg, error]
	}
}
export default apiRequest
