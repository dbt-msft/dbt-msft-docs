const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
	title: 'dbt-sqlserver-docs',
	tagline: 'dbt adapter for sql server',
	url: 'https://dbt-msft.github.io/',
	baseUrl: '/dbt-msft-docs/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'dbt-msft', // Usually your GitHub org/user name.
	projectName: 'dbt-msft-docs', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: 'dbt-sqlserver-docs',
			logo: {
				alt: 'My Site Logo',
				src: 'img/dbt-logo.svg',
			},
			items: [
				{
					type: 'doc',
					docId: 'dbt-sqlserver/overview',
					position: 'left',
					label: 'dbt-sqlserver',
				},
				{
					type: 'doc',
					docId: 'dbt-synapse/overview',
					position: 'left',
					label: 'dbt-synapse',
				},
				{
					href: 'https://github.com/dbt-msft/dbt-sqlserver',
					label: 'GitHub',
					position: 'right',
				}
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'dbt-sqlserver',
							to: '/docs/dbt-sqlserver/overview',
						},
						{
							label: 'dbt-synapse',
							to: '/docs/dbt-synapse/overview',
						}
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'dbt',
							href: 'https://docs.getdbt.com/',
						}
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'dbt-sqlserver GitHub',
							href: 'https://github.com/dbt-msft/dbt-sqlserver',
						},
						{
							label: 'dbt-synapse GitHub',
							href: 'https://github.com/dbt-msft/dbt-synapse',
						}
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Timothy Den Ouden. dbt logo Copyright © 2021 dbt Labs. Built with Docusaurus.`,
		},
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl:
						'https://github.com/dbt-msft/dbt-msft-docs',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
};
