import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {withRootStore} from "../extensions/with-root-store";

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    first_name: types.maybeNull(types.string),
    last_name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    status: types.maybeNull(types.number),
    phone_number: types.maybeNull(types.string),
    user_type: types.maybeNull(types.string),
    access: types.maybeNull(types.string),
    refresh: types.maybeNull(types.string),
    profile_picture: types.maybeNull(types.string),
    remember_me: types.optional(types.boolean, false),
    stored_email: types.maybeNull(types.string),
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access !== null && self.access !== undefined
    },
  }))
  .actions(self => ({
    setApiToken(token: string | null) {
      const api = self.environment.api.apisauce
      self.access = token
      if (token) {
        api?.setHeader('Authorization', 'Bearer ' + token)
      } else {
        api?.deleteHeader('Authorization')
      }
    },
    setUp() {
      if (self.access) {
        self.environment.api.apisauce?.setHeader("Authorization", 'Bearer ' + self.access)
      } else {
        self.environment.api.apisauce?.deleteHeader("Authorization")
      }
    },
    setRememberMe(remember: boolean) {
      self.remember_me = remember
    },
    setStoredEmail(email: string) {
      self.stored_email = email
    },
    setUser(user: any) {
      self.id = user.id
      self.email = user.email
      self.phone_number = user.phone_number
      self.profile_picture = user.profile_picture
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.status = user.status
      self.user_type = user.user_type
    },
    reset() {
      const api = self.environment.api.apisauce
      api?.deleteHeader("Authorization")
      self.id = null
      self.email = null
      self.access = null
      self.refresh = null
      self.phone_number = null
      self.profile_picture = null
      self.first_name = null
      self.last_name = null
      self.status = null
      self.user_type = null
    },
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type LoginStoreType = Instance<typeof LoginStoreModel>

export interface LoginStore extends LoginStoreType {
}

type LoginStoreSnapshotType = SnapshotOut<typeof LoginStoreModel>

export interface LoginStoreSnapshot extends LoginStoreSnapshotType {
}
