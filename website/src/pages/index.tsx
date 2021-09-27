/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '../components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();

	return (
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
	);
}

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();

	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />"
		>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
			</main>
		</Layout>
	);
}
