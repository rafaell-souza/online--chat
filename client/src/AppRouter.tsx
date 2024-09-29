import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './pages/explore';
import NewRoom from './pages/newRoom';
import Chat from './pages/chat';
import Register from './pages/register';
import Login from './pages/login';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Explore />} />
                <Route path="/new-room" element={<NewRoom />} />
                <Route path="/chat/:chatid" element={<Chat />} />
                <Route path="/register" element={< Register /> } />
                <Route path="/login" element={ < Login /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;