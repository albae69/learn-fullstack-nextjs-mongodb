import ThreadCard from '@/components/cards/ThreadCard'
import { fetchPosts } from '@/lib/actions/thread.actions'
import { UserButton, currentUser } from '@clerk/nextjs'

export default async function Home() {
  const result = await fetchPosts(1, 30)
  const user = await currentUser()

  console.log(result.posts)

  return (
    <>
      <h1 className='head-text'>Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No Threads found</p>
        ) : (
          result.posts.map((post) => (
            <ThreadCard
              key={post._id}
              author={post.author}
              comments={post.comments}
              text={post.text}
              community={post.community}
              createdAt={post.createdAt}
              currentUserId={user?.id || ''}
              // isComment
              parentId={post.parentId}
              id={post.id}
            />
          ))
        )}
      </section>
    </>
  )
}
