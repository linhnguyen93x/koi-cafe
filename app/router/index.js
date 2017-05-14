import { createRouter  } from '@expo/ex-navigation'
import AppContainer from '../containers/AppContainer'

// Add new Router here
export default Router = createRouter(() => ({
  home: () => AppContainer,
}));