import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <section className="flex justify-center flex-col items-center h-screen w-full">
            <div className="flex text-gray-400 text-lg items-center ">
                <span className="text-4xl mb-[2px] font-bold">404</span>
                <span className="ml-3 border-l pl-3 py-2">Ops! Page Not Found</span>
            </div>

            <Link to="/" className="mt-3 px-6 border-b border-gray-900 bg-gray-900 bg-opacity-20 text-gray-300 hover:bg-opacity-70">Go back to Home</Link>

        </section>
    );
}

export default NotFound;