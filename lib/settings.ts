export const ITEM_PER_PAGE = 5;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/home(.*)": ["admin", "lecturer", "student"],
  "/list/buildings": ["admin"],
  "/list/lecture_rooms": ["admin"],
  "/list/departments": ["admin"],
  "/list/subjects": ["admin", "lecturer"],
  "/list/lecturers": ["admin", "teacher"],
  "/list/reservations": ["admin", "lecturer"],
};
