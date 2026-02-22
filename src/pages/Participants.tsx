import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Mail, Loader2, UserX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchParticipants, selectFilteredParticipants, clearParticipants, importExternalParticipants, removeParticipant } from '../store/slices/participantsSlice';
import { fetchEvents } from '../store/slices/eventsSlice';
import RegistrationChart from '../components/RegistrationChart';
import { Trash2 } from 'lucide-react';
import '../styles/Participants.css';

const Participants = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');

    const { status, error } = useAppSelector((state) => state.participants);
    const events = useAppSelector((state) => state.events.items);
    const filteredParticipants = useAppSelector((state) =>
        selectFilteredParticipants(state, searchQuery)
    );

    const eventDetails = events.find((e) => e.id === eventId);

    useEffect(() => {
        if (events.length === 0) {
            dispatch(fetchEvents());
        }

        if (eventId) {
            dispatch(fetchParticipants(eventId));
        }

        return () => {
            // Очищення стейту при виході (requirement: cleanup)
            dispatch(clearParticipants());
        };
    }, [eventId, dispatch, events.length]);

    if (status === 'loading' && filteredParticipants.length === 0) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!eventDetails && status !== 'loading') {
        return (
            <div className="participants-container">
                <p>Подію не знайдено.</p>
                <Link to="/" className="back-link">
                    <ArrowLeft size={16} /> Повернутися на головну
                </Link>
            </div>
        );
    }

    return (
        <div className="participants-container">
            <Link to="/" className="back-link">
                <ArrowLeft size={16} /> На головну
            </Link>

            <div className="participants-header">
                <h1>Учасники події <span className="event-name">"{eventDetails?.title}"</span></h1>
                <button
                    className="import-btn"
                    onClick={() => eventId && dispatch(importExternalParticipants(eventId))}
                    disabled={status === 'loading'}
                >
                    Імпортувати учасників
                </button>
            </div>

            <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Пошук за ім'ям або email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <RegistrationChart participants={filteredParticipants} />

            {filteredParticipants.length === 0 ? (
                <div className="no-results">
                    <UserX size={48} className="mx-auto mb-4 opacity-20" />
                    <p>{searchQuery ? 'За вашим запитом нікого не знайдено' : 'Учасників поки немає'}</p>
                </div>
            ) : (
                <div className="participants-list">
                    {filteredParticipants.map((participant) => (
                        <div key={participant.id} className="participant-card">
                            <div className="participant-info-card">
                                <div className="participant-name">{participant.fullName}</div>
                                <div className="participant-email">
                                    {participant.email}
                                </div>
                            </div>
                            <button
                                className="delete-btn"
                                onClick={() => eventId && dispatch(removeParticipant({ eventId, participantId: participant.id }))}
                                title="Видалити учасника"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Participants;
