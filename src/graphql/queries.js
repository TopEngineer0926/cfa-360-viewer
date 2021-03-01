/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPano = /* GraphQL */ `
  query GetPano($id: ID!) {
    getPano(id: $id) {
      id
      title
      thumbnail
      pabout
      ptype
      psize
      sceneArr {
        id
        title
        img
        spots {
          id
          pitch
          yaw
          style
          text
          link
          sceneID
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
        pabout
        ptype
        psize
        sceneArr {
          id
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
      spotID
      owner
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
        spotID
        owner
        msg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
