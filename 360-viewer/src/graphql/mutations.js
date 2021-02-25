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
        hotSpots {
          id
          pitch
          yaw
          type
          layer
          targetYaw
          targetPitch
          text
          sceneId
        }
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
        hotSpots {
          id
          pitch
          yaw
          type
          layer
          targetYaw
          targetPitch
          text
          sceneId
        }
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
        hotSpots {
          id
          pitch
          yaw
          type
          layer
          targetYaw
          targetPitch
          text
          sceneId
        }
      }
      createdAt
      updatedAt
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
export const updateSpot = /* GraphQL */ `
  mutation UpdateSpot(
    $input: UpdateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    updateSpot(input: $input, condition: $condition) {
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
export const deleteSpot = /* GraphQL */ `
  mutation DeleteSpot(
    $input: DeleteSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    deleteSpot(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      owner
      spotID
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
      owner
      spotID
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
      owner
      spotID
      msg
      createdAt
      updatedAt
    }
  }
`;
