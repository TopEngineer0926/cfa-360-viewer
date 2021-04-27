/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPano = /* GraphQL */ `
  query GetPano($id: ID!) {
    getPano(id: $id) {
      id
      title
      category
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
        icon
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
        category
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
          icon
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
      name
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
        name
        msg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSitePermission = /* GraphQL */ `
  query GetSitePermission($id: ID!) {
    getSitePermission(id: $id) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const listSitePermissions = /* GraphQL */ `
  query ListSitePermissions(
    $filter: ModelSitePermissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSitePermissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProjectPermission = /* GraphQL */ `
  query GetProjectPermission($id: ID!) {
    getProjectPermission(id: $id) {
      id
      admins
      editors
      viewers
      createdAt
      updatedAt
    }
  }
`;
export const listProjectPermissions = /* GraphQL */ `
  query ListProjectPermissions(
    $filter: ModelProjectPermissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjectPermissions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        admins
        editors
        viewers
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPermissionSetting = /* GraphQL */ `
  query GetPermissionSetting($id: ID!) {
    getPermissionSetting(id: $id) {
      id
      role
      assignNewSite
      assignProject
      adjustRole
      createNewProject
      createNewScene
      createNewTag
      tagComments
      readContent
      createdAt
      updatedAt
    }
  }
`;
export const listPermissionSettings = /* GraphQL */ `
  query ListPermissionSettings(
    $filter: ModelPermissionSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPermissionSettings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        role
        assignNewSite
        assignProject
        adjustRole
        createNewProject
        createNewScene
        createNewTag
        tagComments
        readContent
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const commentsBySpotId = /* GraphQL */ `
  query CommentsBySpotId(
    $spotID: ID
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsBySpotID(
      spotID: $spotID
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        spotID
        owner
        name
        msg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEditStatus = /* GraphQL */ `
  query GetEditStatus($id: ID!) {
    getEditStatus(id: $id) {
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
export const listEditStatuss = /* GraphQL */ `
  query ListEditStatuss(
    $filter: ModelEditStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEditStatuss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        panoID
        owner
        name
        email
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const editStatusByPano = /* GraphQL */ `
  query EditStatusByPano(
    $panoID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEditStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    editStatusByPano(
      panoID: $panoID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        panoID
        owner
        name
        email
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTemporarySharing = /* GraphQL */ `
  query GetTemporarySharing($id: ID!) {
    getTemporarySharing(id: $id) {
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
export const listTemporarySharings = /* GraphQL */ `
  query ListTemporarySharings(
    $filter: ModelTemporarySharingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemporarySharings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        panoID
        owner
        password
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const sharingByPano = /* GraphQL */ `
  query SharingByPano(
    $panoID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTemporarySharingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sharingByPano(
      panoID: $panoID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        panoID
        owner
        password
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const sharingByPassword = /* GraphQL */ `
  query SharingByPassword(
    $password: String
    $sortDirection: ModelSortDirection
    $filter: ModelTemporarySharingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sharingByPassword(
      password: $password
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        panoID
        owner
        password
        ttl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
