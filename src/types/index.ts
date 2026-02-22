export interface SwimmingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  source: 'Social media' | 'Friends' | 'Found myself';
  registrationDate: string; // YYYY-MM-DD
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  birthDate: string;
  source: 'Social media' | 'Friends' | 'Found myself';
}
