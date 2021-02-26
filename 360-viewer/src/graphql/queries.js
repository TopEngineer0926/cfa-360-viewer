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
          URL
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
export const getSpot = /* GraphQL */ `
  query GetSpot($id: ID!) {
    getSpot(id: $id) {
      id
      contents {
        name
        type
        content
        link
      }
      createdAt
      updatedAt
      comments {
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
  }
`;
export const listSpots = /* GraphQL */ `
  query ListSpots(
    $filter: ModelSpotFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpots(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contents {
          name
          type
          content
          link
        }
        createdAt
        updatedAt
        comments {
          nextToken
        }
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
