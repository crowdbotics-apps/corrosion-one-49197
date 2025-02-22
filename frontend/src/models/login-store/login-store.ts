import {cast, Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {withRootStore} from "../extensions/with-root-store";

export const LanguageModel = types.model("LanguageModel").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
})

export const RegionModel = types.model("RegionModel").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  country_id: types.maybeNull(types.number),
})

export const CredentialModel = types.model("CredentialModel").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  document: types.maybeNull(types.string),
  document_name: types.maybeNull(types.string),
  size: types.maybeNull(types.number),

})

export const SupportDocumentModel = types.model("SupportDocumentModel").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  document: types.maybeNull(types.string),
  size: types.maybeNull(types.number),
})

export const CountryModel = types.model("CountryModel").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
})

const ALLOWED_KEYS_USER = ['id', 'email', 'phone_number', 'first_name', 'last_name',
  'status', 'user_type', 'website', 'linkedin', 'access', 'refresh']

const ALLOWED_KEYS_INSPECTOR = ['date_of_birth', 'languages', 'regions', 'credentials', 'support_documents',
  'countries', 'profile_picture','notify_im_qualified', 'notify_new_message', 'notify_job_applied']

const ALLOWED_KEYS_OWNER = ['date_of_birth', 'languages', 'regions', 'credentials', 'support_documents', 'countries']

const ALLOWED_KEYS = ALLOWED_KEYS_USER.concat(ALLOWED_KEYS_INSPECTOR).concat(ALLOWED_KEYS_OWNER)


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
    website: types.maybeNull(types.string),
    linkedin: types.maybeNull(types.string),
    date_of_birth: types.maybeNull(types.string),
    languages: types.maybeNull(types.array(LanguageModel)),
    regions: types.maybeNull(types.array(RegionModel)),
    credentials: types.maybeNull(types.array(CredentialModel)),
    support_documents: types.maybeNull(types.array(SupportDocumentModel)),
    countries: types.maybeNull(types.array(CountryModel)),
    notify_im_qualified: types.maybeNull(types.boolean),
    notify_new_message: types.maybeNull(types.boolean),
    notify_job_applied: types.maybeNull(types.boolean),

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
      ALLOWED_KEYS_USER.forEach((key) => {
        if (user.hasOwnProperty(key)) { // @ts-ignore
          self[key] = user[key]
        }
      })

      if (user.hasOwnProperty('inspector') && user.inspector) {
        ALLOWED_KEYS_INSPECTOR.forEach((key) => {
          if (user.inspector.hasOwnProperty(key)) { // @ts-ignore
            // @ts-ignore
            self[key] = user.inspector[key]
          }
        })
      }


      if (user.hasOwnProperty('owner') && user.owner) {
        ALLOWED_KEYS_OWNER.forEach((key) => {
          if (user.owner.hasOwnProperty(key)) { // @ts-ignore
            self[key] = user.owner[key]
          }
        })
      }

    },
    reset() {
      const api = self.environment.api.apisauce
      api?.deleteHeader("Authorization")
      ALLOWED_KEYS.forEach((key) => {
        // @ts-ignore
        self[key] = null
      })
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
