import Head from 'next/head';
import Layout from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import postStyles from '../styles/Post.module.css';
import { getAllIds, getData } from '../lib/data';

export async function getStaticPaths() {
  const paths = await getAllIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const itemData = await getData(params.id);
  return {
    props: {
      itemData,
    },
  };
}

export default function Entry({ itemData }) {
  return (
    <Layout>
      <Head>
        <title>{itemData.post_title}</title>
      </Head>
      <article className={postStyles.article}>
        <p className={postStyles.kicker}>WordPress post</p>
        <h1 className={`${utilStyles.headingXl} ${postStyles.title}`}>
          {itemData.post_title}
        </h1>
        {itemData.post_date ? (
          <div className={`${utilStyles.lightText} ${postStyles.meta}`}>
            <Date dateString={itemData.post_date} />
          </div>
        ) : null}
        <div
          className={postStyles.body}
          dangerouslySetInnerHTML={{ __html: itemData.post_content || '' }}
        />
      </article>
    </Layout>
  );
}
