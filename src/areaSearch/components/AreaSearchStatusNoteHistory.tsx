import React, { Component } from "react";
import Collapse from "@/components/collapse/Collapse";
import { formatDate } from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
type Props = {
  statusNotes: Array<Record<string, any>> | null | undefined;
};

class AreaSearchStatusNoteHistory extends Component<Props> {
  render(): JSX.Element {
    const { statusNotes } = this.props;

    if (!statusNotes || statusNotes.length === 0) {
      return null;
    }

    return (
      <Collapse
        defaultOpen
        className="AreaSearchStatusNoteHistory"
        headerTitle="Historia"
      >
        {statusNotes.map((note) => (
          <div
            className="AreaSearchStatusNoteHistory__item"
            key={note.time_stamp}
          >
            <strong>Käsittelijä: </strong>
            {getUserFullName(note.preparer)}{" "}
            {formatDate(note.time_stamp, "dd.MM.yyyy H.mm")}
            <p>{note.note}</p>
          </div>
        ))}
      </Collapse>
    );
  }
}

export default AreaSearchStatusNoteHistory;
