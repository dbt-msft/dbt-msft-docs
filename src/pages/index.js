import React from 'react';
import { Redirect } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


export default function Home() {
	const { siteConfig } = useDocusaurusContext();
	return <Redirect to={`${siteConfig.baseUrl}docs/dbt-sqlserver`} />;
}
