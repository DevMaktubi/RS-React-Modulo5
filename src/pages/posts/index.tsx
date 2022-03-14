import {client} from '../../prismic'
import {RichText} from 'prismic-dom'

import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss'
import { useEffect, useState } from 'react';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  data: Post[]
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
            <a key={post.slug} href='#'>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = await client.getAllByType('post')

  const posts = result.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find( content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }
  })

  return {
    props: {
      data: posts
    },
    revalidate: 60 * 60 * 24, // 24 Hours
  }
}