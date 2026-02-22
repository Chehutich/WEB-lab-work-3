import { Outlet, Link } from 'react-router-dom';
import { Sun, Moon, Waves } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { toggleTheme } from '../store/slices/themeSlice';
import '../styles/Layout.css';

const Layout = () => {
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}>
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <Waves size={28} />
                        <span>SwimEvents</span>
                    </Link>

                    <div className="nav-actions">
                        <button
                            className="theme-toggle"
                            onClick={() => dispatch(toggleTheme())}
                            title={isDarkMode ? 'Переключити на світлу тему' : 'Переключити на темну тему'}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/" className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
                            Всі події
                        </Link>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
