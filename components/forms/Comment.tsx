'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CommentValidation } from '@/lib/validations/thread'
import { z } from 'zod'
import { Textarea } from '../ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { addCommentToThread } from '@/lib/actions/thread.actions'
import { Input } from '../ui/input'
import Image from 'next/image'

interface Props {
  threadId: string
  currentUserId: string
  currentUserImg: string
}

export default function Comment({
  threadId,
  currentUserId,
  currentUserImg,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    )

    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
          <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
              <FormItem className='flex  w-full gap-3'>
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt='profile image'
                    width={48}
                    height={48}
                    className='rounded-full object-cover'
                  />
                </FormLabel>
                <FormControl className='border-none bg-transparent'>
                  <Input
                    type='text'
                    className='no-focus text-light-1 outline-none'
                    placeholder='Comment...'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type='submit' className='comment-form_btn'>
            Reply
          </Button>
        </form>
      </Form>
    </div>
  )
}
