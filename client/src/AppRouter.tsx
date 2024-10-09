import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ImSpinner8 } from "react-icons/im";

const Explore = lazy(() => import('./pages/Explore'));
const CreateChat = lazy(() => import('./pages/CreateChat'));
const Chat = lazy(() => import('./pages/Chat'));
const Register = lazy(() => import('./pages/register'));
const Login = lazy(() => import('./pages/login'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));

import AuthComponent from './components/AuthComponent';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <section className='w-full h-screen flex justify-center items-center'>
                    <ImSpinner8 className='text-2xl text-white animate-spin' />
                </section>
            }>
                <Routes>
                    <Route path="/" element={<AuthComponent component={<Explore />} />} />
                    <Route path="/new-room" element={<AuthComponent component={<CreateChat />} />} />
                    <Route path="/chat/:chatid" element={<AuthComponent component={<Chat />} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/search" element={<AuthComponent component={<Search />} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRoutes;
