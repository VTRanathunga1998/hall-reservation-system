export const hallEvents = [
  {
    title: "Conference: Tech Trends 2025",
    allday: false,
    start: new Date(2025, 8, 25, 9, 0),
    end: new Date(2025, 8, 25, 12, 0),
    resource: { hall: "Main Auditorium" },
  },
  {
    title: "Wedding Reception - Silva Family",
    allday: false,
    start: new Date(2025, 8, 26, 18, 0),
    end: new Date(2025, 8, 26, 23, 0),
    resource: { hall: "Banquet Hall A" },
  },
  {
    title: "Yoga Workshop",
    allday: false,
    start: new Date(2025, 8, 26, 7, 0),
    end: new Date(2025, 8, 26, 9, 0),
    resource: { hall: "Community Hall" },
  },
  {
    title: "Board Meeting",
    allday: false,
    start: new Date(2025, 8, 27, 14, 0),
    end: new Date(2025, 8, 27, 16, 0),
    resource: { hall: "Meeting Room 1" },
  },
  {
    title: "Music Concert",
    allday: false,
    start: new Date(2025, 8, 30, 19, 0),
    end: new Date(2025, 8, 30, 22, 0),
    resource: { hall: "Main Auditorium" },
  },
];

export interface Building {
  id: string;
  name: string;
  description?: string;
}

export interface Room {
  id: string;
  buildingId: string;
  name: string;
  capacity?: number;
}

export interface Reservation {
  id: string;
  roomId: string;
  title: string;
  start: Date;
  end: Date;
}

// Temporary buildings
export const buildings: Building[] = [
  {
    id: "1",
    name: "Main Building",
    description: "Central administration building",
  },
  {
    id: "2",
    name: "Science Block",
    description: "Laboratories and lecture halls",
  },
  { id: "3", name: "Sports Complex", description: "Gym and indoor stadium" },
  {
    id: "4",
    name: "Main Building II",
    description: "Central administration building II",
  },
  {
    id: "5",
    name: "Science Block II",
    description: "Laboratories and lecture halls II",
  },
  {
    id: "6",
    name: "Sports Complex II",
    description: "Gym and indoor stadium II",
  },
  {
    id: "7",
    name: "Sports Complex III",
    description: "Gym and indoor stadium III",
  },
];

// Temporary rooms
export const rooms: Room[] = [
  { id: "101", buildingId: "1", name: "Auditorium A", capacity: 200 },
  { id: "102", buildingId: "1", name: "Meeting Room A", capacity: 50 },
  { id: "201", buildingId: "2", name: "Physics Lab", capacity: 40 },
  { id: "202", buildingId: "2", name: "Chemistry Lab", capacity: 35 },
  { id: "301", buildingId: "3", name: "Indoor Stadium", capacity: 500 },
  { id: "103", buildingId: "1", name: "Auditorium B", capacity: 200 },
  { id: "222", buildingId: "1", name: "Meeting Room B", capacity: 50 },
  { id: "205", buildingId: "2", name: "Physics Lab II", capacity: 40 },
  { id: "209", buildingId: "2", name: "Chemistry Lab II", capacity: 35 },
  { id: "310", buildingId: "3", name: "Indoor Stadium II", capacity: 500 },
];
