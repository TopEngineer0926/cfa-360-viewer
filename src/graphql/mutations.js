/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPano = /* GraphQL */ `
  mutation CreatePano(
    $input: CreatePanoInput!
    $condition: ModelPanoConditionInput
  ) {
    createPano(input: $input, condition: $condition) {
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
          contents {
            type
            name
            thumbnail
            link
          }
          about
        }
      }
      layers {
        id
        name
      }
      createdAt
      updatedAt
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
          contents {
            type
            name
            thumbnail
            link
          }
          about
        }
      }
      layers {
        id
        name
      }
      createdAt
      updatedAt
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
          contents {
            type
            name
            thumbnail
            link
          }
          about
        }
      }
      layers {
        id
        name
      }
      createdAt
      updatedAt
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
      spotID
      owner
      name
      msg
      createdAt
      updatedAt
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
      spotID
      owner
      name
      msg
      createdAt
      updatedAt
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
      spotID
      owner
      name
      msg
      createdAt
      updatedAt
    }
  }
`;
