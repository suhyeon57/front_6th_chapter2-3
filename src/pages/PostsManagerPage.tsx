import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SearchFilterBar } from '@/widgets/search-filter-bar'
import {
  Pagination,
  Button,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
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
import { CommentRenderUI } from '@/features/comment/ui/CommentRenderUI'
import { highlightText } from '@/shared/utils/highlightText'
import {
  useSearchPosts,
  useAddPosts,
  useFetchPosts,
  useDeletePosts,
  useUpdatePosts,
} from '@/features/post'

import {
  PostRenderUi,
  AddPostDialog,
  UpdatePostDialog,
  DetailPostDialog,
} from '@/features/post/'

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
  const [selectedPost, setSelectedPost] = useState(null)
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc'
  )
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState([])
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
  const [selectedUser, setSelectedUser] = useState(null)

  // URL 업데이트 함수
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
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/posts/tags')
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error('태그 가져오기 오류:', error)
    }
  }

  // 게시물 검색
  const searchPosts = useSearchPosts(
    searchQuery,
    setPosts,
    setTotal,
    setLoading,
    fetchPosts
  )

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag) => {
    if (!tag || tag === 'all') {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch('/api/users?limit=0&select=username,image'),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error)
    }
    setLoading(false)
  }

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
  const deleteComment = useDeleteComment(comments, setComments)

  // 댓글 좋아요
  const likeComment = useLikeComment(comments, setComments)

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
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
    fetchPostsByTag(value)
    updateURL()
  }

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
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
      <Dialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={newComment.body}
              onChange={(e) =>
                setNewComment({ ...newComment, body: e.target.value })
              }
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={selectedComment?.body || ''}
              onChange={(e) =>
                setSelectedComment({ ...selectedComment, body: e.target.value })
              }
            />
            <Button
              onClick={() => {
                if (selectedComment) updateComment(selectedComment)
              }}
            >
              댓글 업데이트
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <DetailPostDialog
        showPostDetailDialog={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
      >
        <CommentRenderUI
          postId={selectedPost?.id}
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

      {/* 사용자 정보 모달 */}

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <img
              src={selectedUser?.image}
              alt={selectedUser?.username}
              className='w-24 h-24 rounded-full mx-auto'
            />
            <h3 className='text-xl font-semibold text-center'>
              {selectedUser?.username}
            </h3>
            <div className='space-y-2'>
              <p>
                <strong>이름:</strong> {selectedUser?.firstName}{' '}
                {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address},{' '}
                {selectedUser?.address?.city}, {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} -{' '}
                {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
