import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import homeStyles from '../styles/Home.module.css';
import { getSortedList } from '../lib/data';

export async function getStaticProps() {
  const allData = await getSortedList();
  return {
    props: {
      allData,
    },
  };
}

export default function Home({ allData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${homeStyles.introCard}`}>
        <p>
          Hi, I&apos;m Jess Reyes. This Next.js app reads posts from my
          WordPress REST API instead of a local JSON file.
        </p>
        <p>
          The list below comes from{' '}
          <a href="https://dev-cs-5513-week-11.pantheonsite.io/">
            CS5513WEEK11
          </a>
          .
        </p>
      </section>
      <section
        className={`${utilStyles.headingMd} ${utilStyles.padding1px} ${homeStyles.blogSection}`}
      >
        <h2 className={`${utilStyles.headingLg} ${homeStyles.blogHeading}`}>
          Posts
        </h2>
        <ul className={`${utilStyles.list} ${homeStyles.postList}`}>
          {allData.map(({ id, name, date }) => (
            <li className={`${utilStyles.listItem} ${homeStyles.postCard}`} key={id}>
              <Link href={`/${id}`} className={homeStyles.postTitle}>
                {name}
              </Link>
              <br />
              {date ? (
                <small className={`${utilStyles.lightText} ${homeStyles.postDate}`}>
                  <Date dateString={date} />
                </small>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
