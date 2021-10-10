const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const pkg = require('../optimal/package.json');

module.exports = {
	title: 'Optimal',
	tagline: pkg.description,
	url: 'https://optimallib.dev',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.svg',
	organizationName: 'milesj',
	projectName: 'optimal',

	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/milesj/optimal/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					editUrl: 'https://github.com/milesj/optimal/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],

	themeConfig: {
		navbar: {
			title: 'Optimal',
			logo: {
				alt: 'Optimal',
				src: 'img/logo.svg',
			},
			items: [
				{
					label: `v${pkg.version}`,
					position: 'left',
					href: `https://www.npmjs.com/package/optimal`,
				},
				{
					to: 'docs',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left',
				},
				{
					to: 'api',
					label: 'API',
					position: 'left',
				},
				{
					href: 'https://github.com/milesj/optimal',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [],
			copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Icon by <a href="https://thenounproject.com/term/crystal/570598/">Joshua Nichol</a>.`,
		},
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
		},
	},
	plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				packages: ['optimal'],
				minimal: true,
			},
		],
	],
};
