/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePano = /* GraphQL */ `
  subscription OnCreatePano {
    onCreatePano {
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
export const onUpdatePano = /* GraphQL */ `
  subscription OnUpdatePano {
    onUpdatePano {
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
export const onDeletePano = /* GraphQL */ `
  subscription OnDeletePano {
    onDeletePano {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateEditStatus = /* GraphQL */ `
  subscription OnCreateEditStatus {
    onCreateEditStatus {
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
export const onUpdateEditStatus = /* GraphQL */ `
  subscription OnUpdateEditStatus {
    onUpdateEditStatus {
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
export const onDeleteEditStatus = /* GraphQL */ `
  subscription OnDeleteEditStatus {
    onDeleteEditStatus {
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
export const onCreateTemporarySharing = /* GraphQL */ `
  subscription OnCreateTemporarySharing {
    onCreateTemporarySharing {
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
export const onUpdateTemporarySharing = /* GraphQL */ `
  subscription OnUpdateTemporarySharing {
    onUpdateTemporarySharing {
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
export const onDeleteTemporarySharing = /* GraphQL */ `
  subscription OnDeleteTemporarySharing {
    onDeleteTemporarySharing {
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
