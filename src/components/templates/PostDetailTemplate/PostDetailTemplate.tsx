'use client'

import React, { useMemo } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'
import Avatar from '@/components/atoms/Avatar'
import { Text } from '@/components/atoms/Text'
import PostOptionsDropdown from '@/components/molcules/PostOptionsDropdown'
import CommentListContainer from '@/components/organisms/CommentList/CommentListContainer'
import { LikeDisLikeContainer } from '@/components/organisms/LikeDisLikeContainer'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Post from '@/types/post'
import './index.scss'

type PostDetailTemplateProps = {
  postId: string
  initPost: Post
}

export function PostDetailTemplate({
  postId,
  initPost,
}: PostDetailTemplateProps) {
  const { title, comment, image, _id } = initPost
  const { author } = initPost
  const { title: PostTitle, description } = JSON.parse(title)
  const { currentUser } = useCurrentUser()
  const cachedCurrentUser = useMemo(() => currentUser, [currentUser])
  const isEqualUser = cachedCurrentUser?._id === author._id

  return (
    <div className="post-detail">
      <div className="post-detail__header">
        <Avatar
          size={5}
          src={initPost?.author?.image || ''}
          text={author.fullName}
          textStyle={{
            fontWeight: 'bold',
            marginLeft: '15px',
          }}
        />
        {isEqualUser && <PostOptionsDropdown postId={_id} />}
      </div>
      <Text textStyle="heading0-bold">{PostTitle}</Text>
      <div className="post-detail__post-container">
        <Text textStyle="body1">{parse(description) as string}</Text>
        {image && (
          <Image
            src={image || ''}
            width={250}
            height={250}
            alt="image"
            style={{
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      <LikeDisLikeContainer like={555} dislike={5511} />
      <CommentListContainer postId={postId} initComments={comment} />
    </div>
  )
}
