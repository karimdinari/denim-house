import { prisma } from '../lib/prisma.js'

export const forumService = {

  async getPosts() {
    return prisma.forumPost.findMany({
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getPostById(id) {
    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    if (!post) throw new Error('Post not found')
    return post
  },

  async createPost({ authorId, title, content }) {
    return prisma.forumPost.create({
      data: { authorId, title, content },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      }
    })
  },

  async updatePost(id, { title, content }, userId) {
    const post = await prisma.forumPost.findUnique({ where: { id } })
    if (!post) throw new Error('Post not found')
    if (post.authorId !== userId) throw new Error('Not authorized')

    return prisma.forumPost.update({
      where: { id },
      data: { title, content }
    })
  },

  async deletePost(id, userId, role) {
    const post = await prisma.forumPost.findUnique({ where: { id } })
    if (!post) throw new Error('Post not found')
    if (post.authorId !== userId && role !== 'MANAGER')
      throw new Error('Not authorized')

    await prisma.forumPost.delete({ where: { id } })
    return { message: 'Post deleted' }
  },

  async likePost(id) {
    return prisma.forumPost.update({
      where: { id },
      data: { likes: { increment: 1 } }
    })
  },

  async createComment({ postId, authorId, content }) {
    return prisma.forumComment.create({
      data: { postId, authorId, content },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      }
    })
  },

  async deleteComment(id, userId, role) {
    const comment = await prisma.forumComment.findUnique({ where: { id } })
    if (!comment) throw new Error('Comment not found')
    if (comment.authorId !== userId && role !== 'MANAGER')
      throw new Error('Not authorized')

    await prisma.forumComment.delete({ where: { id } })
    return { message: 'Comment deleted' }
  }
}