import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, UserPlus, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchEvents } from '../store/slices/eventsSlice';
import '../styles/Home.css';

const Home = () => {
    const dispatch = useAppDispatch();
    const { items: events, status, error } = useAppSelector((state) => state.events);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEvents());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="error-message">
                <p>Помилка: {error}</p>
                <button
                    onClick={() => dispatch(fetchEvents())}
                    className="btn-primary mt-4"
                >
                    Спробувати ще раз
                </button>
            </div>
        );
    }

    return (
        <div className="home-container">
            <h1 className="home-title">Доступні Події</h1>

            <div className="events-grid">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-header">
                            <h2>{event.title}</h2>
                        </div>

                        <div className="event-info">
                            <div className="info-item">
                                <Calendar size={16} />
                                <span>{event.date}</span>
                            </div>
                            <div className="info-item">
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>
                        </div>

                        <div className="event-actions">
                            <Link to={`/register/${event.id}`} className="btn-primary">
                                <span>Реєстрація</span>
                            </Link>
                            <Link to={`/participants/${event.id}`} className="btn-secondary">
                                <span>Учасники</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
