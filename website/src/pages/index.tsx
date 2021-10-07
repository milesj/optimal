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
		title: '🔑 Immutable schemas',
		description: (
			<>
				Process any value with our immutable, fluent, stateless, and typed schemas. With this API
				design, compose and reuse schemas with ease!
			</>
		),
	},
	{
		title: '🧶 Typed values',
		description: (
			<>
				We provide a TypeScript-first schema with a powerful inferrence API for many value types,
				such as, numbers, strings, objects, arrays, unions, tuples, and many more!
			</>
		),
	},
	{
		title: '👣 Small footprint',
		description: (
			<>
				Optimal has been engineered to provide the best performance, the lowest possible filesize
				(less than 5kB), and a great developer experience.
			</>
		),
	},
];

function Feature({ title, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();

	return (
		<Layout description={siteConfig.tagline} title="">
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
								// eslint-disable-next-line react/no-array-index-key
								<Feature key={idx} {...props} />
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
}
