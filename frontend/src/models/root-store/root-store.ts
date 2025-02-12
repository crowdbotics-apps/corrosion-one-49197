import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {LoginStoreModel} from '../login-store/login-store'
import {withEnvironment} from "../extensions/with-environment";

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').extend(withEnvironment)
  .props({
    loginStore: types.optional(LoginStoreModel, {}),
  }).views(self => ({}))
  .actions(self => ({
    reset() {
      self.loginStore.reset();
    }
  }));


/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {
}
