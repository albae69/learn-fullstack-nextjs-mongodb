import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null

  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const post = await fetchThreadById(params.id)

  return (
    <section className='relative'>
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

      <div className='mt-7'>
        <Comment
          threadId={post.id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
        />
      </div>

      <div className='mt-10'>
        {post.children.map((item) => (
          <ThreadCard
            key={item._id}
            author={item.author}
            comments={item.children}
            text={item.text}
            community={item.community}
            createdAt={item.createdAt}
            currentUserId={user?.id || ''}
            isComment
            parentId={item.parentId}
            id={item.id}
          />
        ))}
      </div>
    </section>
  )
}
