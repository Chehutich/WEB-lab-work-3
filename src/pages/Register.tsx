import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { registerNewParticipant } from '../store/slices/participantsSlice';
import { fetchEvents } from '../store/slices/eventsSlice';
import { RegistrationFormData } from '../types';
import '../styles/Register.css';

const schema = z.object({
    fullName: z.string().min(3, { message: "Ім'я повинно містити принаймні 3 символи" }),
    email: z.string().email({ message: 'Некоректна адреса email' }),
    birthDate: z.string().refine((val) => {
        if (!val) return false;
        const dob = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age >= 12;
    }, { message: 'Вам повинно бути принаймні 12 років' }),
    source: z.enum(['Social media', 'Friends', 'Found myself'], {
        message: 'Будь ласка, оберіть звідки ви дізналися про подію',
    }),
});

const Register = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const events = useAppSelector((state) => state.events.items);
    const eventDetails = events.find((e) => e.id === eventId);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(schema),
        defaultValues: { fullName: '', email: '', birthDate: '', source: 'Social media' }
    });

    useEffect(() => {
        if (events.length === 0) {
            dispatch(fetchEvents());
        }
    }, [dispatch, events.length]);

    const onSubmit = async (data: RegistrationFormData) => {
        if (!eventId) return;

        const resultAction = await dispatch(registerNewParticipant({ eventId, data }));
        if (registerNewParticipant.fulfilled.match(resultAction)) {
            navigate(`/participants/${eventId}`);
        }
    };

    if (!eventDetails && events.length > 0) {
        return (
            <div className="register-container">
                <p>Подію не знайдено.</p>
                <Link to="/" className="back-link">
                    <ArrowLeft size={16} /> Повернутися на головну
                </Link>
            </div>
        );
    }

    return (
        <div className="register-container">
            <Link to="/" className="back-link">
                <ArrowLeft size={16} /> На головну
            </Link>

            <div className="register-card">
                <h1 className="register-title">Реєстрація на подію</h1>
                <p className="register-subtitle">Ви реєструєтесь на: <strong>{eventDetails?.title}</strong></p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Повне ім'я</label>
                        <input
                            id="fullName"
                            type="text"
                            className="form-input"
                            {...register('fullName')}
                        />
                        {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            {...register('email')}
                        />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="birthDate">Дата народження</label>
                        <input
                            id="birthDate"
                            type="date"
                            className="form-input"
                            {...register('birthDate')}
                        />
                        {errors.birthDate && <span className="form-error">{errors.birthDate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Звідки ви дізналися про нас?</label>
                        <div className="radio-group">
                            {['Social media', 'Friends', 'Found myself'].map((s) => (
                                <label key={s} className="radio-label">
                                    <input
                                        type="radio"
                                        value={s}
                                        className="radio-input"
                                        {...register('source')}
                                    />
                                    {s === 'Social media' ? 'Соцмережі' : s === 'Friends' ? 'Друзі' : 'Самостійно'}
                                </label>
                            ))}
                        </div>
                        {errors.source && <span className="form-error">{errors.source.message}</span>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Реєстрація...
                            </>
                        ) : (
                            'Зареєструватися'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
