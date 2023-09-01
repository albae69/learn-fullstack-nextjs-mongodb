import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import UserCard from '@/components/cards/UserCard'

export default async function page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <h1 className='head-text mb-10'>Activity</h1>
    </section>
  )
}
