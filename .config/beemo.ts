export default {
	module: '@beemo/dev',
	drivers: [
		'eslint',
		'jest',
		'prettier',
		[
			'typescript',
			{
				buildFolder: 'dts',
				declarationOnly: true,
			},
		],
	],
	settings: {
		esm: true,
	},
};
