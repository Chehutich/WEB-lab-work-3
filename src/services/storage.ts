import { SwimmingEvent, Participant } from '../types';

const INITIAL_EVENTS: SwimmingEvent[] = [
  { id: '1', title: 'Summer Swim Meet', date: '2025-06-15', location: 'City Pool' },
  { id: '2', title: 'Winter Relay', date: '2025-12-10', location: 'Indoor Arena' },
  { id: '3', title: 'Open Water Challenge', date: '2025-08-20', location: 'Lake Serenity' },
  { id: '4', title: 'Masters Spring Cup', date: '2025-04-05', location: 'Olympic Center' },
  { id: '5', title: 'Junior Splash Festival', date: '2025-05-12', location: 'Youth Aquatic Club' },
  { id: '6', title: 'Midnight Swim Marathon', date: '2025-07-22', location: 'Moonlight Bay' },
];

const INITIAL_PARTICIPANTS: Record<string, Participant[]> = {
  '1': [
    { id: 'p1', fullName: 'Олександр Петренко', email: 'olex@example.com', birthDate: '1995-03-10', source: 'Friends', registrationDate: '2026-02-15' },
    { id: 'p2', fullName: 'Марія Ковальчук', email: 'maria@example.com', birthDate: '1998-07-22', source: 'Social media', registrationDate: '2026-02-16' },
    { id: 'p3', fullName: 'Андрій Сидоренко', email: 'andrii@example.com', birthDate: '2001-01-15', source: 'Social media', registrationDate: '2026-02-16' },
    { id: 'p1_1', fullName: 'Дмитро Шевченко', email: 'dima@example.com', birthDate: '2005-02-10', source: 'Found myself', registrationDate: '2026-02-17' },
    { id: 'p1_2', fullName: 'Юлія Мельник', email: 'yulia@example.com', birthDate: '1997-08-15', source: 'Friends', registrationDate: '2026-02-18' },
    { id: 'p1_3', fullName: 'Артем Козак', email: 'artem@example.com', birthDate: '1993-12-20', source: 'Social media', registrationDate: '2026-02-18' },
    { id: 'p1_4', fullName: 'Вікторія Бондар', email: 'viki@example.com', birthDate: '2000-04-05', source: 'Friends', registrationDate: '2026-02-19' },
  ],
  '2': [
    { id: 'p4', fullName: 'Тетяна Бойко', email: 'tanya@example.com', birthDate: '1992-05-30', source: 'Friends', registrationDate: '2026-02-18' },
    { id: 'p2_1', fullName: 'Микола Ткаченко', email: 'mykola@example.com', birthDate: '1988-06-12', source: 'Found myself', registrationDate: '2026-02-19' },
    { id: 'p2_2', fullName: 'Наталія Кравченко', email: 'nata@example.com', birthDate: '1994-01-25', source: 'Social media', registrationDate: '2026-02-20' },
    { id: 'p2_3', fullName: 'Сергій Мороз', email: 'serg.m@example.com', birthDate: '1991-03-30', source: 'Friends', registrationDate: '2026-02-21' },
    { id: 'p2_4', fullName: 'Олена Савченко', email: 'alena.s@example.com', birthDate: '1996-09-08', source: 'Found myself', registrationDate: '2026-02-22' },
  ],
  '3': [
    { id: 'p5', fullName: 'Віктор Кравченко', email: 'victor@example.com', birthDate: '1985-09-12', source: 'Found myself', registrationDate: '2026-02-14' },
    { id: 'p6', fullName: 'Олена Мороз', email: 'elena@example.com', birthDate: '1999-12-03', source: 'Social media', registrationDate: '2026-02-15' },
    { id: 'p7', fullName: 'Сергій Ткачук', email: 'serg@example.com', birthDate: '1994-06-25', source: 'Friends', registrationDate: '2026-02-16' },
    { id: 'p3_1', fullName: 'Максим Коваленко', email: 'max@example.com', birthDate: '2002-11-11', source: 'Social media', registrationDate: '2026-02-17' },
    { id: 'p3_2', fullName: 'Ірина Гриценко', email: 'ira@example.com', birthDate: '1995-05-05', source: 'Found myself', registrationDate: '2026-02-17' },
    { id: 'p3_3', fullName: 'Олег Лисенко', email: 'oleg@example.com', birthDate: '1987-02-28', source: 'Friends', registrationDate: '2026-02-18' },
    { id: 'p3_4', fullName: 'Світлана Палій', email: 'sveta@example.com', birthDate: '2001-07-14', source: 'Social media', registrationDate: '2026-02-18' },
  ]
};

const initStorage = () => {
  try {
    if (!localStorage.getItem('events')) {
      localStorage.setItem('events', JSON.stringify(INITIAL_EVENTS));
    }

    // Завжди оновлюємо учасників, якщо їх занадто мало (для оновлення списку тестовими даними)
    const existingParticipants = JSON.parse(localStorage.getItem('participants') || '{}');
    if (Object.keys(existingParticipants).length < 3) {
      localStorage.setItem('participants', JSON.stringify(INITIAL_PARTICIPANTS));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

export const getEvents = (): SwimmingEvent[] => {
  try {
    initStorage();
    const data = localStorage.getItem('events');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const getParticipants = (eventId: string): Participant[] => {
  try {
    initStorage();
    const data = localStorage.getItem('participants');
    const participants = data ? JSON.parse(data) : {};
    return participants[eventId] || [];
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
};

export const registerParticipant = (eventId: string, participantData: Omit<Participant, 'id' | 'registrationDate'>): Participant => {
  try {
    const data = localStorage.getItem('participants');
    const participants = data ? JSON.parse(data) : {};

    if (!participants[eventId]) {
      participants[eventId] = [];
    }

    const newParticipant: Participant = {
      ...participantData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0]
    };

    participants[eventId].push(newParticipant);
    localStorage.setItem('participants', JSON.stringify(participants));

    return newParticipant;
  } catch (error) {
    console.error('Error registering participant:', error);
    throw new Error('Не вдалося зберегти дані');
  }
};

export const saveImportedParticipants = (eventId: string, imported: Participant[]) => {
  try {
    const data = localStorage.getItem('participants');
    const participants = data ? JSON.parse(data) : {};

    if (!participants[eventId]) {
      participants[eventId] = [];
    }

    participants[eventId] = [...participants[eventId], ...imported];
    localStorage.setItem('participants', JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving imported participants:', error);
  }
};

export const deleteParticipant = (eventId: string, participantId: string) => {
  try {
    const data = localStorage.getItem('participants');
    const participants = data ? JSON.parse(data) : {};

    if (participants[eventId]) {
      participants[eventId] = participants[eventId].filter((p: Participant) => p.id !== participantId);
      localStorage.setItem('participants', JSON.stringify(participants));
    }
  } catch (error) {
    console.error('Error deleting participant:', error);
  }
};
