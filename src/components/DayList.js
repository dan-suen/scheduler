import React from "react";

import DayListItem from "components/DayListItem";

export default function DayList(props) {
  let array = props.days.map((element) => {
    return (
      <DayListItem
        key={element.id}
        value={element.name}
        spots={element.spots}
        selected={element.name === props.value}
        onClick={props.onClick}
      ></DayListItem>
    );
  });
  return <ul>{array}</ul>;
}
