/* eslint-disable react/no-array-index-key */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

interface FeatureItem {
	title: string;
	description: JSX.Element;
}

const FeatureList: FeatureItem[] = [
	{
		title: 'Easy to Use',
		description: (
			<>
				Docusaurus was designed from the ground up to be easily installed and used to get your
				website up and running quickly.
			</>
		),
	},
	{
		title: 'Focus on What Matters',
		description: (
			<>
				Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your
				docs into the <code>docs</code> directory.
			</>
		),
	},
	{
		title: 'Powered by React',
		description: (
			<>
				Extend or customize your website layout by reusing React. Docusaurus can be extended while
				reusing the same header and footer.
			</>
		),
	},
];

function Feature({ title, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();

	return (
		<Layout
			description="Description will go into a meta tag in <head />"
			title={`Hello from ${siteConfig.title}`}
		>
			<header className={clsx('hero hero--primary', styles.heroBanner)}>
				<div className="container">
					<h1 className="hero__title">{siteConfig.title}</h1>
					<p className="hero__subtitle">{siteConfig.tagline}</p>
					<div className={styles.buttons}>
						<Link
							className={clsx('button button--secondary button--lg', styles.getStarted)}
							to={useBaseUrl('docs/')}
						>
							Get started
						</Link>

						<iframe
							frameBorder="0"
							scrolling="0"
							src="https://ghbtns.com/github-btn.html?user=milesj&repo=optimal&type=star&count=true&size=large"
							title="GitHub"
						/>
					</div>
				</div>
			</header>

			<main>
				<section className={styles.features}>
					<div className="container">
						<div className="row">
							{FeatureList.map((props, idx) => (
								<Feature key={idx} {...props} />
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
}
