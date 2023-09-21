'use client'

import { useEffect, useState } from 'react'
import { deleteFollow, postFollow } from '@/services/follow'
import User from '@/types/user'
import { useCurrentUser } from './useCurrentUser'

/**
 *
 * @returns param isFollowing: 로그인한 유저가 현재 페이지의 유저를 팔로우하고 있는지 여부
 * @returns param isFollowed: 현재 페이지의 유저가 로그인한 유저를 팔로우하고 있는지 여부
 * @returns param unavailable: 팔로우, 팔로잉 기능을 사용할 수 없는 경우
 * @returns param followToggle: 팔로우, 팔로잉 기능을 토글하는 함수
 * @returns param followerCount: 현재 페이지의 유저의 팔로워 수
 * @returns param followingCount: 현재 페이지의 유저의 팔로잉 수
 */
const useFollow = (userData: User | undefined) => {
  const { currentUser } = useCurrentUser()

  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [followId, setFollowId] = useState('')
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    if (!userData || !currentUser) return
    setFollowerCount(() => userData.followers?.length ?? 0)
    setFollowingCount(() => userData.following?.length ?? 0)
    setIsFollowing(
      () =>
        userData.followers?.some(
          (follower) => follower.follower === currentUser?._id,
        ) ?? false,
    )
    setIsFollowed(
      () =>
        currentUser?.followers?.some(
          (follower) => userData._id === follower._id,
        ) ?? false,
    )
  }, [currentUser, userData])

  const followToggle = async () => {
    if (!userData || !currentUser) return
    if (isFollowing) {
      setFollowerCount((prev) => prev - 1)
      setIsFollowing(false)
      const followData = currentUser.following?.find(
        ({ user }) => user === userData._id,
      )

      setFollowId(() => followData?._id ?? '')
      await deleteFollow(followData?._id ?? followId)

      currentUser.following?.splice(
        currentUser.following.findIndex(
          ({ follower }) => follower === userData._id,
        ),
        1,
      )
      userData.followers?.splice(
        userData.followers.findIndex(
          (follower) => follower._id === currentUser._id,
        ),
        1,
      )
    } else {
      setIsFollowing(true)
      setFollowerCount((prev) => prev + 1)
      const followData = await postFollow(userData._id)
      setFollowId(() => followData._id ?? '')
      userData.followers?.push({
        _id: currentUser._id,
        follower: currentUser._id,
        user: userData._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      currentUser.following?.push(followData)
    }
  }

  return {
    isFollowing,
    isFollowed,
    followerCount,
    followingCount,
    unavailable: !currentUser || currentUser._id === userData?._id,
    followToggle,
  }
}

export default useFollow
