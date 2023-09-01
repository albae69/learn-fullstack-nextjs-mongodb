'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDB } from '../mongoose'
import Thread from '../models/thread.model'
import { FilterQuery } from 'mongoose'

interface User {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: User): Promise<void> {
  connectToDB()

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    )

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB()
    return await User.findOne({ id: userId })
    // .populate({
    //   path: 'communities',
    //   model: 'Community',
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB()
    // Find all threads authored by the given user id

    // TODO: Populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name id image',
        },
      },
    })

    return threads
  } catch (error: any) {
    throw new Error(`Error fetch user posts`, error)
  }
}

export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 10,
  searchString = '',
  sortBy = 'desc',
}) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if (searchString.trim() != '') {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    const sortOptions = { createdAt: sortBy }

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUserCount = await User.countDocuments(query)

    const users = await userQuery.exec()
    const isNext = totalUserCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    throw new Error('Error fetchUsers: ', error)
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB()

    // find all threads created by user
    const userThreads = await Thread.find({ author: userId })

    // Collect all the children thread ids
    const childrenThreadIds = userThreads.reduce((acc, userThreads) => {
      return acc.concat(userThreads.children)
    })

    const replies = await Thread.find({
      _id: { $in: childrenThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name, image, _id',
    })
  } catch (error: any) {
    throw new Error('Error getActivity: ', error)
  }
}
