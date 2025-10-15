export type ProductStatus = 'pending' | 'claimed' | 'purchased'

export interface MemberSummary {
  id: string
  username: string
  role: 'owner' | 'admin' | 'member'
}

export interface ProductItem {
  id: string
  name: string
  status: ProductStatus
  quantity: number
  category?: string
  notes?: string
  assignedTo?: MemberSummary | null
  updatedAt: string
  createdAt: string
}

export interface GroupSummary {
  id: string
  name: string
  description?: string
  ownerId: string
  membersCount: number
  pendingProducts: number
  updatedAt: string
}

export interface GroupDetail extends GroupSummary {
  products: ProductItem[]
  members: MemberSummary[]
  chatRoomId: string
}

export interface ChatMessage {
  id: string
  groupId: string
  senderId: string
  senderName: string
  body: string
  createdAt: string
}

export interface InvitePayload {
  username: string
}

export interface CatalogItem {
  id: string
  name: string
  category?: string
}

export interface CreateProductPayload {
  name: string
  quantity?: number
  category?: string
  notes?: string
}

export interface GroupFilters {
  search?: string
  status?: ProductStatus | 'all'
}
