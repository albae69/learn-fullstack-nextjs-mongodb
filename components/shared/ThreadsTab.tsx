import { redirect } from 'next/navigation'

import { fetchUserPosts } from '@/lib/actions/user.actions'
import ThreadCard from '../cards/ThreadCard'

interface Props {
  currentUserId: string
  accountId: string
  accountType: string
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result = await fetchUserPosts(accountId)

  if (!result) redirect('/')

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          comments={thread.children}
          text={thread.text}
          community={thread.community}
          createdAt={thread.createdAt}
          currentUserId={currentUserId}
          isComment
          parentId={thread.parentId}
          id={thread.id}
        />
      ))}
    </section>
  )
}
