//mocks axios data
let fixtures = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1,
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1,
    },
  ],
  appointments: {
    1: { id: 1, time: "12pm", interview: null },
    2: {
      id: 2,
      time: "1pm",
      interview: { student: "Archie Cohen", interviewer: 2 },
    },
    3: {
      id: 3,
      time: "2pm",
      interview: { student: "Leopold Silvers", interviewer: 4 },
    },
    4: { id: 4, time: "3pm", interview: null },
  },
  interviewers: {
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
    3: {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png",
    },
    4: {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg",
    },
  },
};

//mocks axios
export default {
  get: jest.fn((url) => {
    if (url === "/api/days") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.days,
      });
    }

    if (url === "/api/appointments") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.appointments,
      });
    }

    if (url === "/api/interviewers") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.interviewers,
      });
    }
  }),
  put: jest.fn((url) => {
    //mocks changing of appointment 1
    if (url === "/api/appointments/1") {
      fixtures.days[0].spots--;
      fixtures.appointments[1].interview = {
        student: "Lydia Miller-Jones",
        interviewer: 1,
      };
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
    //mocks changing of appointment 2
    if (url === "/api/appointments/2") {
      fixtures.appointments[2].interview = { student: "Hello", interviewer: 1 };
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
    //resets the remote database
    if (url === "/api/reset") {
      fixtures = {
        days: [
          {
            id: 1,
            name: "Monday",
            appointments: [1, 2],
            interviewers: [1, 2],
            spots: 1,
          },
          {
            id: 2,
            name: "Tuesday",
            appointments: [3, 4],
            interviewers: [3, 4],
            spots: 1,
          },
        ],
        appointments: {
          1: { id: 1, time: "12pm", interview: null },
          2: {
            id: 2,
            time: "1pm",
            interview: { student: "Archie Cohen", interviewer: 2 },
          },
          3: {
            id: 3,
            time: "2pm",
            interview: { student: "Leopold Silvers", interviewer: 4 },
          },
          4: { id: 4, time: "3pm", interview: null },
        },
        interviewers: {
          1: {
            id: 1,
            name: "Sylvia Palmer",
            avatar: "https://i.imgur.com/LpaY82x.png",
          },
          2: {
            id: 2,
            name: "Tori Malcolm",
            avatar: "https://i.imgur.com/Nmx0Qxo.png",
          },
          3: {
            id: 3,
            name: "Mildred Nazir",
            avatar: "https://i.imgur.com/T2WwVfS.png",
          },
          4: {
            id: 4,
            name: "Cohana Roy",
            avatar: "https://i.imgur.com/FK8V841.jpg",
          },
        },
      };
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
  }),
  delete: jest.fn((url) => {
    //mocks axios delete
    if (url === "/api/appointments/2") {
      fixtures.days[0].spots++;
      fixtures.appointments[2].interview = null;
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
  }),
};
