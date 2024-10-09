import AppRoutes from "./AppRouter"
import { UserDataProvider } from "./context/userData";

function App() {
  return (
    <UserDataProvider>
      <AppRoutes />
    </UserDataProvider>
  )
}

export default App