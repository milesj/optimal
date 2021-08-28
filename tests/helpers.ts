export function runInProd(cb: () => unknown) {
	return () => {
		process.env.NODE_ENV = 'production';

		try {
			cb();
		} finally {
			process.env.NODE_ENV = 'test';
		}
	};
}
