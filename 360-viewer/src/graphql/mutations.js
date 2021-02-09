/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPano = /* GraphQL */ `
  mutation CreatePano(
    $input: CreatePanoInput!
    $condition: ModelPanoConditionInput
  ) {
    createPano(input: $input, condition: $condition) {
      id
    }
  }
`;
export const updatePano = /* GraphQL */ `
  mutation UpdatePano(
    $input: UpdatePanoInput!
    $condition: ModelPanoConditionInput
  ) {
    updatePano(input: $input, condition: $condition) {
      id
      title
      img {
        region
        bucket
        key
      }
      thumbnail {
        region
        bucket
        key
      }
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content {
              region
              bucket
              key
            }
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img {
              region
              bucket
              key
            }
            thumbnail {
              region
              bucket
              key
            }
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
export const deletePano = /* GraphQL */ `
  mutation DeletePano(
    $input: DeletePanoInput!
    $condition: ModelPanoConditionInput
  ) {
    deletePano(input: $input, condition: $condition) {
      id
      title
      img {
        region
        bucket
        key
      }
      thumbnail {
        region
        bucket
        key
      }
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content {
              region
              bucket
              key
            }
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img {
              region
              bucket
              key
            }
            thumbnail {
              region
              bucket
              key
            }
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
export const createSpot = /* GraphQL */ `
  mutation CreateSpot(
    $input: CreateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    createSpot(input: $input, condition: $condition) {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
export const updateSpot = /* GraphQL */ `
  mutation UpdateSpot(
    $input: UpdateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    updateSpot(input: $input, condition: $condition) {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
export const deleteSpot = /* GraphQL */ `
  mutation DeleteSpot(
    $input: DeleteSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    deleteSpot(input: $input, condition: $condition) {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
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
