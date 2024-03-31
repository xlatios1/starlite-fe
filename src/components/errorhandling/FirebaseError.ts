export default class FirebaseErrorUtil {
	private static SOMETHING_WENT_WRONG_ERROR = 'Oops! Something went wrong.'

	private static INVALID_CREDENTIALS =
		'Firebase: Error (auth/invalid-login-credentials).'
	private static MISSING_PASSWORD = 'Firebase: Error (auth/missing-password).'
	private static EMAIL_USED = 'Firebase: Error (auth/email-already-in-use).'
	private static WEAK_PASSWORD =
		'Firebase: Password should be at least 6 characters (auth/weak-password).'
	private static TOO_MANY_REQUESTS = 'Firebase: Error (auth/too-many-requests).'

	static getErrorMessage(error: Error): string {
		const errorMessage = error.message
		console.log('error message:', errorMessage)
		switch (errorMessage) {
			case FirebaseErrorUtil.INVALID_CREDENTIALS:
				return 'Wrong email or password!'
			case FirebaseErrorUtil.MISSING_PASSWORD:
				return 'Invalid password!'
			case FirebaseErrorUtil.EMAIL_USED:
				return 'Email is already in use.'
			case FirebaseErrorUtil.WEAK_PASSWORD:
				return 'Password should be at least 6 characters!'
			case FirebaseErrorUtil.TOO_MANY_REQUESTS:
				return 'Please try again later!'
			default:
				return FirebaseErrorUtil.SOMETHING_WENT_WRONG_ERROR
		}
	}
}
