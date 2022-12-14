import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getByAltText,
  getByPlaceholderText,
  getAllByTestId,
  queryByText,
} from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Form", () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    //finds empty appointment on render
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    //enter form via add button and mocks input
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getAllByTestId(appointment, "interviewer-pic")[0]);
    fireEvent.click(getByText(appointment, "Save"));

    //checks appointments is updated
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //checks spots is updated
    const day = getAllByTestId(container, "day").find((day) => {
      return queryByText(day, "Monday");
    });
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    //resets data
    axios.put("/api/reset");
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    //finds appointment on render
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((element) => {
      return queryByText(element, "Archie Cohen");
    });

    //clicks delete button and confirms confirmation message
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //waits for rerender
    await waitForElement(() => getByAltText(appointment, "Add"));

    //checks spots is updated
    const day = getAllByTestId(container, "day").find((day) => {
      return queryByText(day, "Monday");
    });
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    //resets data
    axios.put("/api/reset");
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    //finds appointment on render
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((element) => {
      return queryByText(element, "Archie Cohen");
    });

    //enters edit state and inputs changes
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Hello" },
    });

    //expect save button click to update data both locally and in api
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Hello"));

    //checks spots avaliable is not changed
    const day = getAllByTestId(container, "day").find((day) => {
      return queryByText(day, "Monday");
    });
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    //resets data
    axios.put("/api/reset");
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    //finds empty appointment on render
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    //clicks add
    fireEvent.click(getByAltText(appointment, "Add"));

    //attempts to input and save
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getAllByTestId(appointment, "interviewer-pic")[0]);
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //checks for error message and clicks to close
    await waitForElement(() => getByText(appointment, "Could Not Save"));
    fireEvent.click(getByAltText(appointment, "Close"));

    //expects form to appear again
    expect(
      getByPlaceholderText(appointment, "Enter Student Name")
    ).toBeInTheDocument();

    //checks appointment has not been saved
    fireEvent.click(getByText(appointment, "Cancel"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    //hence spots should not be updated
    const day = getAllByTestId(container, "day").find((day) => {
      return queryByText(day, "Monday");
    });
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    //finds appointment on render
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((element) => {
      return queryByText(element, "Archie Cohen");
    });

    //calls delete
    fireEvent.click(getByAltText(appointment, "Delete"));

    //checks for deletion confirmation and deleting mode
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //checks for error message
    await waitForElement(() => getByText(appointment, "Could Not Delete"));
    fireEvent.click(getByAltText(appointment, "Close"));

    //checks appointment still exists
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    //checks navbar
    const day = getAllByTestId(container, "day").find((day) => {
      return queryByText(day, "Monday");
    });
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
