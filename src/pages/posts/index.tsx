import {client} from '../../prismic'
import * as prismicH from '@prismicio/helpers'

import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss'
import { useEffect, useState } from 'react';

interface PostsProps {
  data: Post[]
}
interface Post {
  id: string;
  last_publication_date: any;
  data: {
    title: [
      {
        text: string
      },
    ]
    content: [
      {
        text: string;
      }
    ]
  };
}

export default function Posts({data}: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    console.log(data)
    setPosts(data)
  }, [data])
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts && posts.map(post => (
            <a key={post.id} href='#'>
              <time dateTime={prismicH.asDate(post.last_publication_date).toISOString()}>{prismicH.asDate(post.last_publication_date).toLocaleString()}</time>
              <strong>{post.data.title[0].text}</strong>
              <p>{post.data.content[0].text}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const posts = await client.getAllByType('post')

  return {
    props: {
      data: posts
    },
    revalidate: 60 * 60 * 24, // 24 Hours
  }
}