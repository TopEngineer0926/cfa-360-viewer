/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        img
        thumbnail
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              content
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              img
              thumbnail
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getPano = /* GraphQL */ `
  query GetPano($id: ID!) {
    getPano(id: $id) {
      id
      title
      img
      thumbnail
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img
            thumbnail
            createdAt
            updatedAt
            spots {
              nextToken
            }
          }
          comments {
            items {
              id
              owner
              spotID
              content
              reply
              updatedAt
              repliedAt
              createdAt
            }
            nextToken
          }
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
        name
        contents {
          name
          type
          content
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img
          thumbnail
          createdAt
          updatedAt
          spots {
            items {
              id
              name
              panoID
              createdAt
              updatedAt
            }
            nextToken
          }
        }
        comments {
          items {
            id
            owner
            spotID
            content
            reply
            updatedAt
            repliedAt
            createdAt
            spot {
              id
              name
              panoID
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getSpot = /* GraphQL */ `
  query GetSpot($id: ID!) {
    getSpot(id: $id) {
      id
      name
      contents {
        name
        type
        content
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img
        thumbnail
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              content
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              img
              thumbnail
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
          nextToken
        }
      }
      comments {
        items {
          id
          owner
          spotID
          content
          reply
          updatedAt
          repliedAt
          createdAt
          spot {
            id
            name
            contents {
              name
              type
              content
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              img
              thumbnail
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      owner
      spotID
      content
      reply
      updatedAt
      repliedAt
      createdAt
      spot {
        id
        name
        contents {
          name
          type
          content
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img
          thumbnail
          createdAt
          updatedAt
          spots {
            items {
              id
              name
              panoID
              createdAt
              updatedAt
            }
            nextToken
          }
        }
        comments {
          items {
            id
            owner
            spotID
            content
            reply
            updatedAt
            repliedAt
            createdAt
            spot {
              id
              name
              panoID
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
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
        content
        reply
        updatedAt
        repliedAt
        createdAt
        spot {
          id
          name
          contents {
            name
            type
            content
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img
            thumbnail
            createdAt
            updatedAt
            spots {
              nextToken
            }
          }
          comments {
            items {
              id
              owner
              spotID
              content
              reply
              updatedAt
              repliedAt
              createdAt
            }
            nextToken
          }
        }
      }
      nextToken
    }
  }
`;
