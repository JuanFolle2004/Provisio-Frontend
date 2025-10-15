import { apiFetch } from './client'
import type {
  CatalogItem,
  CreateProductPayload,
  GroupDetail,
  GroupFilters,
  GroupSummary,
  InvitePayload,
  ProductItem,
  ProductStatus,
} from './types'

export const getGroups = () => apiFetch<GroupSummary[]>('/groups')

export const getGroupDetail = (groupId: string, filters?: GroupFilters) =>
  apiFetch<GroupDetail>(/groups/, {
    params: {
      search: filters?.search ?? '',
      status: filters?.status ?? 'all',
    },
  })

export const createGroup = (payload: { name: string; description?: string }) =>
  apiFetch<GroupSummary>('/groups', {
    method: 'POST',
    json: payload,
  })

export const inviteMember = (groupId: string, payload: InvitePayload) =>
  apiFetch<void>(/groups//invites, {
    method: 'POST',
    json: payload,
  })

export const updateProductStatus = (
  groupId: string,
  productId: string,
  status: ProductStatus,
) =>
  apiFetch<ProductItem>(/groups//products/, {
    method: 'PATCH',
    json: { status },
  })

export const createProduct = (groupId: string, payload: CreateProductPayload) =>
  apiFetch<ProductItem>(/groups//products, {
    method: 'POST',
    json: payload,
  })

export const createProductFromCatalog = (groupId: string, catalogItemId: string) =>
  apiFetch<ProductItem>(/groups//products, {
    method: 'POST',
    json: { catalogItemId },
  })

export const getCatalog = () => apiFetch<CatalogItem[]>('/catalog')
