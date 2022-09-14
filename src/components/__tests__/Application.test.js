import React from "react";

import {render, cleanup, waitForElement, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Form", () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return (waitForElement(() => getByText("Monday"))
    .then(()=>{
      fireEvent.click(getByText("Tuesday"))
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    }));
  });


  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    const {container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target : {value : "Lydia Miller-Jones"}})
    fireEvent.click(getAllByTestId(appointment, "interviewer-pic")[0])
    fireEvent.click(getByText(appointment, "Save"))

    expect(getByText(appointment, "Saving")).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday")
    })
    expect(getByText(day, "no spots remaining")).toBeInTheDocument()
  });
})
