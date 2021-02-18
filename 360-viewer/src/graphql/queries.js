/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPano = /* GraphQL */ `
  query GetPano($id: ID!) {
    getPano(id: $id) {
      id
      title
      thumbnail
      scenes {
        title
        img
        spots {
          id
          name
          layer
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPanos = /* GraphQL */ `
  query ListPanos(
    $filter: ModelPanoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPanos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        thumbnail
        scenes {
          title
          img
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      owner
      spotID
      msg
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        spotID
        msg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const commentsBySpot = /* GraphQL */ `
  query CommentsBySpot(
    $spotID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsBySpot(
      spotID: $spotID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        spotID
        msg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
