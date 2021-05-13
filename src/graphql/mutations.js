/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPano = /* GraphQL */ `
  mutation CreatePano(
    $input: CreatePanoInput!
    $condition: ModelPanoConditionInput
  ) {
    createPano(input: $input, condition: $condition) {
      id
      prototypeName
      category
      thumbnail
      prototypeEdition
      description
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
        icon
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
      prototypeName
      category
      thumbnail
      prototypeEdition
      description
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
        icon
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
      prototypeName
      category
      thumbnail
      prototypeEdition
      description
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
        icon
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
export const createSitePermission = /* GraphQL */ `
  mutation CreateSitePermission(
    $input: CreateSitePermissionInput!
    $condition: ModelSitePermissionConditionInput
  ) {
    createSitePermission(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const updateSitePermission = /* GraphQL */ `
  mutation UpdateSitePermission(
    $input: UpdateSitePermissionInput!
    $condition: ModelSitePermissionConditionInput
  ) {
    updateSitePermission(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const deleteSitePermission = /* GraphQL */ `
  mutation DeleteSitePermission(
    $input: DeleteSitePermissionInput!
    $condition: ModelSitePermissionConditionInput
  ) {
    deleteSitePermission(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const createProjectPermission = /* GraphQL */ `
  mutation CreateProjectPermission(
    $input: CreateProjectPermissionInput!
    $condition: ModelProjectPermissionConditionInput
  ) {
    createProjectPermission(input: $input, condition: $condition) {
      id
      admins
      editors
      viewers
      createdAt
      updatedAt
    }
  }
`;
export const updateProjectPermission = /* GraphQL */ `
  mutation UpdateProjectPermission(
    $input: UpdateProjectPermissionInput!
    $condition: ModelProjectPermissionConditionInput
  ) {
    updateProjectPermission(input: $input, condition: $condition) {
      id
      admins
      editors
      viewers
      createdAt
      updatedAt
    }
  }
`;
export const deleteProjectPermission = /* GraphQL */ `
  mutation DeleteProjectPermission(
    $input: DeleteProjectPermissionInput!
    $condition: ModelProjectPermissionConditionInput
  ) {
    deleteProjectPermission(input: $input, condition: $condition) {
      id
      admins
      editors
      viewers
      createdAt
      updatedAt
    }
  }
`;
export const createSiteSetting = /* GraphQL */ `
  mutation CreateSiteSetting(
    $input: CreateSiteSettingInput!
    $condition: ModelSiteSettingConditionInput
  ) {
    createSiteSetting(input: $input, condition: $condition) {
      type
      config
      createdAt
      updatedAt
    }
  }
`;
export const updateSiteSetting = /* GraphQL */ `
  mutation UpdateSiteSetting(
    $input: UpdateSiteSettingInput!
    $condition: ModelSiteSettingConditionInput
  ) {
    updateSiteSetting(input: $input, condition: $condition) {
      type
      config
      createdAt
      updatedAt
    }
  }
`;
export const deleteSiteSetting = /* GraphQL */ `
  mutation DeleteSiteSetting(
    $input: DeleteSiteSettingInput!
    $condition: ModelSiteSettingConditionInput
  ) {
    deleteSiteSetting(input: $input, condition: $condition) {
      type
      config
      createdAt
      updatedAt
    }
  }
`;
export const createEditStatus = /* GraphQL */ `
  mutation CreateEditStatus(
    $input: CreateEditStatusInput!
    $condition: ModelEditStatusConditionInput
  ) {
    createEditStatus(input: $input, condition: $condition) {
      id
      panoID
      owner
      name
      email
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const updateEditStatus = /* GraphQL */ `
  mutation UpdateEditStatus(
    $input: UpdateEditStatusInput!
    $condition: ModelEditStatusConditionInput
  ) {
    updateEditStatus(input: $input, condition: $condition) {
      id
      panoID
      owner
      name
      email
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const deleteEditStatus = /* GraphQL */ `
  mutation DeleteEditStatus(
    $input: DeleteEditStatusInput!
    $condition: ModelEditStatusConditionInput
  ) {
    deleteEditStatus(input: $input, condition: $condition) {
      id
      panoID
      owner
      name
      email
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const createTemporarySharing = /* GraphQL */ `
  mutation CreateTemporarySharing(
    $input: CreateTemporarySharingInput!
    $condition: ModelTemporarySharingConditionInput
  ) {
    createTemporarySharing(input: $input, condition: $condition) {
      id
      panoID
      owner
      password
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const updateTemporarySharing = /* GraphQL */ `
  mutation UpdateTemporarySharing(
    $input: UpdateTemporarySharingInput!
    $condition: ModelTemporarySharingConditionInput
  ) {
    updateTemporarySharing(input: $input, condition: $condition) {
      id
      panoID
      owner
      password
      ttl
      createdAt
      updatedAt
    }
  }
`;
export const deleteTemporarySharing = /* GraphQL */ `
  mutation DeleteTemporarySharing(
    $input: DeleteTemporarySharingInput!
    $condition: ModelTemporarySharingConditionInput
  ) {
    deleteTemporarySharing(input: $input, condition: $condition) {
      id
      panoID
      owner
      password
      ttl
      createdAt
      updatedAt
    }
  }
`;
