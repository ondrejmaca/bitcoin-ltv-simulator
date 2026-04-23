import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './graphql/mockClient'
import { Dashboard } from './Dashboard'

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="app">
        <div className="app__header">
          <div className="app__logo">₿</div>
          <span className="app__brand">Bitcoin LTV Simulator</span>
        </div>
        <Dashboard />
      </div>
    </ApolloProvider>
  )
}
