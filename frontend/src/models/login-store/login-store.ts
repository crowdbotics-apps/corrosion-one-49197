import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {withRootStore} from "../extensions/with-root-store";
import {ROLES} from "../../services/constants";

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    title: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    group: types.maybeNull(types.string),
    is_superuser: types.maybeNull(types.boolean),
    email: types.maybeNull(types.string),
    phone_number: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
    profile_picture: types.maybeNull(types.string),
    permission_type: types.maybeNull(types.string),
    manufacturer_id: types.maybeNull(types.number),
    is_alliance_employee: types.maybeNull(types.boolean),
    shopify_link: types.maybeNull(types.string),
    isEditingQuantity: types.maybeNull(types.boolean),
    shoppingCartQuantiy: types.maybeNull(types.number),
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access_token !== null && self.access_token !== undefined
    },
    get isAdmin() {
      return (self.group === ROLES.ADMIN.name || self.is_superuser)
    },
    get isProjectManager() {
      return self.group === ROLES.PROJECT_MANAGER.name
    },
    get isSupplyManager() {
      return self.group === ROLES.SUPPLY_MANAGER.name
    },
    get isSubContractorRep() {
      return self.group === ROLES.SUB_CONTRACTOR_REP.name
    },
    get isViewer() {
      return (self.group === ROLES.SUPPLY_MANAGER.name || self.group === ROLES.PROJECT_MANAGER.name || self.group === ROLES.SUB_CONTRACTOR_REP.name) && self.permission_type === 'Viewer'
    }
  }))
  .actions(self => ({
    setApiToken(token: string | null) {
      const api = self.environment.api.apisauce
      self.access_token = token
      if (token) {
        api?.setHeader('Authorization', 'Bearer ' + token)
      } else {
        api?.deleteHeader('Authorization')
      }
    },
    setUp() {
      if (self.access_token) {
        self.environment.api.apisauce?.setHeader("Authorization", 'Bearer ' + self.access_token)
      } else {
        self.environment.api.apisauce?.deleteHeader("Authorization")
      }
    },
    setUser(user: any) {
      self.id = user.id
      self.title = user.title
      self.name = user.name
      self.email = user.email
      self.group = user.group
      self.phone_number = user.phone_number
      self.is_superuser = user.is_superuser
      self.profile_picture = user.profile_picture
      self.permission_type = user.permission_type
      self.manufacturer_id = user.manufacturer
      self.is_alliance_employee = user.is_alliance_employee
      self.shopify_link = user.shopify_link
    },
    setShoppingCartQuantity(quantity: any) {
      self.shoppingCartQuantiy = quantity
    },
    setIsEditingQuantity(isEditingQuantity: any) {
      self.isEditingQuantity = isEditingQuantity
    },
    reset() {
      const api = self.environment.api.apisauce
      api?.deleteHeader("Authorization")
      self.id = null
      self.title = null
      self.name = null
      self.email = null
      self.access_token = null
      self.refresh_token = null
      self.phone_number = null
      self.is_superuser = null
      self.profile_picture = null
      self.group = null
      self.permission_type = null
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
