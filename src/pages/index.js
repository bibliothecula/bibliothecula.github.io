import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <main>
        <div className="container">
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.tagline}</p>
          <a href="/docs/intro">Enter the database →</a>
        </div>
      </main>
    </Layout>
  );
}
