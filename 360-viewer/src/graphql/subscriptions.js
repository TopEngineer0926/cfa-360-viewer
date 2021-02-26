/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePano = /* GraphQL */ `
  subscription OnCreatePano {
    onCreatePano {
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
export const onUpdatePano = /* GraphQL */ `
  subscription OnUpdatePano {
    onUpdatePano {
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
export const onDeletePano = /* GraphQL */ `
  subscription OnDeletePano {
    onDeletePano {
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
export const onCreateSpot = /* GraphQL */ `
  subscription OnCreateSpot {
    onCreateSpot {
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
export const onUpdateSpot = /* GraphQL */ `
  subscription OnUpdateSpot {
    onUpdateSpot {
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
export const onDeleteSpot = /* GraphQL */ `
  subscription OnDeleteSpot {
    onDeleteSpot {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      owner
      spotID
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
      owner
      spotID
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
      owner
      spotID
      msg
      createdAt
      updatedAt
    }
  }
`;
