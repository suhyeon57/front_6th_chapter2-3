import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SearchFilterBar, PostHeader } from '@/widgets'
import { Pagination, Card, CardContent } from '@/shared/ui'
import {
  useLikeComment,
  useDeleteComment,
  useAddComment,
  useUpdateComment,
  useFetchComment,
} from '@/features/comment/'
import {
  NewComment,
  selectedCommentType,
  CommentsByPost,
} from '@/entities/comment/model/types'
import {
  CommentRenderUI,
  AddCommentDialog,
  UpdateCommentDialog,
} from '@/features/comment/'
import { highlightText } from '@/shared/utils/highlightText'
import {
  useSearchPosts,
  useAddPosts,
  useFetchPosts,
  useDeletePosts,
  useUpdatePosts,
  PostRenderUi,
  AddPostDialog,
  UpdatePostDialog,
  DetailPostDialog,
  useFetchTags,
} from '@/features/post'

import { useOpenUser, OpenUserModalDialog } from '@/features/user'
import { SelectedUser } from '@/entities/user/model/types'
import { Post } from '@/entities/post/model/types'

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'))
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'))
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get('search') || ''
  )
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc'
  )
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '')
  const [comments, setComments] = useState<CommentsByPost>({})
  const [selectedComment, setSelectedComment] =
    useState<selectedCommentType | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({
    body: '',
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null) // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set('skip', skip.toString())
    if (limit) params.set('limit', limit.toString())
    if (searchQuery) params.set('search', searchQuery)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    if (selectedTag) params.set('tag', selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = useFetchPosts(limit, skip, setPosts, setTotal, setLoading)

  // 태그 가져오기
  const fetchTags = useFetchTags(setTags)

  // 게시물 검색
  const searchPosts = useSearchPosts(
    searchQuery,
    setPosts,
    setTotal,
    setLoading,
    fetchPosts,
    selectedTag // tag가 undefined거나 'all'이면 전체, 아니면 태그별
  )

  // const fetchPostsByTag = async (tag) => {
  //   if (!tag || tag === 'all') {
  //     fetchPosts()
  //     return
  //   }
  //   setLoading(true)
  //   try {
  //     const [postsResponse, usersResponse] = await Promise.all([
  //       fetch(`/api/posts/tag/${tag}`),
  //       fetch('/api/users?limit=0&select=username,image'),
  //     ])
  //     const postsData = await postsResponse.json()
  //     const usersData = await usersResponse.json()

  //     const postsWithUsers = postsData.posts.map((post) => ({
  //       ...post,
  //       author: usersData.users.find((user) => user.id === post.userId),
  //     }))

  //     setPosts(postsWithUsers)
  //     setTotal(postsData.total)
  //   } catch (error) {
  //     console.error('태그별 게시물 가져오기 오류:', error)
  //   }
  //   setLoading(false)
  // }

  // 게시물 추가
  const addPost = useAddPosts(
    posts,
    setPosts,
    setShowAddDialog,
    newPost,
    setNewPost
  )

  // 게시물 업데이트
  const updatePost = useUpdatePosts(
    selectedPost,
    posts,
    setPosts,
    setShowEditDialog
  )

  // 게시물 삭제
  const deletePost = useDeletePosts(posts, setPosts)

  // 댓글 가져오기
  const fetchComments = useFetchComment(setComments, comments)

  // 댓글 추가
  const addComment = useAddComment(
    newComment,
    setNewComment,
    setComments,
    setShowAddCommentDialog
  )

  // 댓글 업데이트
  const updateComment = useUpdateComment(setComments, setShowEditCommentDialog)

  // 댓글 삭제
  const deleteComment = useDeleteComment(setComments)

  // 댓글 좋아요
  const likeComment = useLikeComment(comments, setComments)

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = useOpenUser(setSelectedUser, setShowUserModal)

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    fetchPosts(selectedTag)
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get('skip') || '0'))
    setLimit(parseInt(params.get('limit') || '10'))
    setSearchQuery(params.get('search') || '')
    setSortBy(params.get('sortBy') || '')
    setSortOrder(params.get('sortOrder') || 'asc')
    setSelectedTag(params.get('tag') || '')
  }, [location.search])

  const handleTagChange = (value: string) => {
    setSelectedTag(value)
    fetchPosts(value)
    updateURL()
  }

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <PostHeader onShowAddDialog={setShowAddDialog} />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilterBar
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onTagChange={handleTagChange}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onSearch={searchPosts}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostRenderUi
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              deletePost={deletePost}
              highlightText={highlightText}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            total={total}
            limit={limit}
            onLimitChange={setLimit}
            skip={skip}
            onSkipChange={setSkip}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        showAddDialog={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <UpdatePostDialog
        showEditDialog={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        updatePost={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        showAddCommentDialog={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <UpdateCommentDialog
        showEditCommentDialog={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <DetailPostDialog
        showPostDetailDialog={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
      >
        <CommentRenderUI
          postId={selectedPost?.id ?? 0} // 또는 postId={selectedPost ? selectedPost.id : 0}
          comments={comments}
          searchQuery={searchQuery}
          setNewComment={setNewComment}
          setShowAddCommentDialog={setShowAddCommentDialog}
          setSelectedComment={setSelectedComment}
          setShowEditCommentDialog={setShowEditCommentDialog}
          likeComment={likeComment}
          deleteComment={deleteComment}
        />
      </DetailPostDialog>

      {/* 사용자 모달 */}
      <OpenUserModalDialog
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        selectedUser={selectedUser}
      />
    </Card>
  )
}

export default PostsManager
